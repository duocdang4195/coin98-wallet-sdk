import * as borsh from "@project-serum/borsh";
import { TransactionInstruction } from "@solana/web3.js";
import camelCase from "camelcase";
import { snakeCase } from "snake-case";
import { BorshService } from "./borshService";
import { IdlCoder } from "./idl_Coder";


export class IdlParserService {

  constructor(idl) {
    this.ixLayout = IdlParserService.parseIxLayout(idl)
    this.accountLayouts = IdlParserService.parseAccountLayout(idl)

    this.build(idl)
  }

  static parseIxLayout(idl) {
    const stateMethods = idl.state ? idl.state.methods : [];

    const ixLayouts = stateMethods
      .map((m) => {
        let fieldLayouts = m.args.map((arg) => {
          return IdlCoder.fieldLayout(
            arg,
            Array.from([...(idl.accounts ?? []), ...(idl.types ?? [])])
          );
        });
        const name = camelCase(m.name);
        return [name, borsh.struct(fieldLayouts, name)];
      })
      .concat(
        idl.instructions.map((ix) => {
          let fieldLayouts = ix.args.map((arg) =>
            IdlCoder.fieldLayout(
              arg,
              Array.from([...(idl.accounts ?? []), ...(idl.types ?? [])])
            )
          );
          const name = camelCase(ix.name);
          return [name, borsh.struct(fieldLayouts, name)];
        })
      );
    return new Map(ixLayouts);
  }

  static parseAccountLayout(idl){
    const layouts= idl.accounts.map((acc) => {
      return [acc.name, IdlCoder.typeDefLayout(acc, idl.types)];
    });

    return new Map(layouts)
  }

  build(idl) {
    idl.instructions.map((inx) => {
      const inxImplement = (args, ctx, programId) => {
        const layout = this.ixLayout.get(inx.name);
        const data = BorshService.anchorSerialize(snakeCase(inx.name), layout, args, 1000)
        const keys = inx.accounts.map((item) => ({ pubkey: ctx[item.name], isWritable: item.isMut, isSigner: item.isSigner }))

        if(ctx.remainingAccounts) {
          keys.push(...ctx.remainingAccounts)
        }

        return new TransactionInstruction({
          data,
          keys,
          programId
        })
      }
      this[inx.name] = inxImplement
    })

    idl.accounts.map((account) => {
      const decode = (data) => {
        return BorshService.anchorDeserialize(this.accountLayouts.get(account.name), data)
      }

      this[`decode${account.name}Account`] = decode
    })
  }
}

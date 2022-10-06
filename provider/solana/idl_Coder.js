import * as borsh from '@project-serum/borsh';
import camelCase from 'camelcase';

export class IdlCoder {
  static fieldLayout(field, types) {
    const fieldName =
      field.name !== undefined ? camelCase(field.name) : undefined;
    switch (field.type) {
      case 'bool': {
        return borsh.bool(fieldName);
      }
      case 'u8': {
        return borsh.u8(fieldName);
      }
      case 'i8': {
        return borsh.i8(fieldName);
      }
      case 'u16': {
        return borsh.u16(fieldName);
      }
      case 'i16': {
        return borsh.i16(fieldName);
      }
      case 'u32': {
        return borsh.u32(fieldName);
      }
      case 'i32': {
        return borsh.i32(fieldName);
      }
      case 'f32': {
        return borsh.f32(fieldName);
      }
      case 'u64': {
        return borsh.u64(fieldName);
      }
      case 'i64': {
        return borsh.i64(fieldName);
      }
      case 'f64': {
        return borsh.f64(fieldName);
      }
      case 'u128': {
        return borsh.u128(fieldName);
      }
      case 'i128': {
        return borsh.i128(fieldName);
      }
      case 'bytes': {
        return borsh.vecU8(fieldName);
      }
      case 'string': {
        return borsh.str(fieldName);
      }
      case 'publicKey': {
        return borsh.publicKey(fieldName);
      }
      default: {
        if ('vec' in field.type) {
          return borsh.vec(
            IdlCoder.fieldLayout(
              {
                name: undefined,
                type: field.type.vec,
              },
              types
            ),
            fieldName
          );
        } else if ('option' in field.type) {
          return borsh.option(
            IdlCoder.fieldLayout(
              {
                name: undefined,
                type: field.type.option,
              },
              types
            ),
            fieldName
          );
        } else if ('defined' in field.type) {
          const defined = field.type.defined;
          // User defined type.
          if (types === undefined) {
            throw new Error('User defined types not provided');
          }
          const filtered = types.filter((t) => t.name === defined);
          if (filtered.length !== 1) {
            throw new Error(`Type not found: ${JSON.stringify(field)}`);
          }
          return IdlCoder.typeDefLayout(filtered[0], types, fieldName);
        } else if ('array' in field.type) {
          let arrayTy = field.type.array[0];
          let arrayLen = field.type.array[1];
          let innerLayout = IdlCoder.fieldLayout(
            {
              name: undefined,
              type: arrayTy,
            },
            types
          );
          return borsh.array(innerLayout, arrayLen, fieldName);
        } else {
          throw new Error(`Not yet implemented: ${field}`);
        }
      }
    }
  }

  static typeDefLayout(typeDef, types = [], name) {
    if (typeDef.type.kind === 'struct') {
      const fieldLayouts = typeDef.type.fields.map((field) => {
        const x = IdlCoder.fieldLayout(field, types);
        return x;
      });
      return borsh.struct(fieldLayouts, name);
    } else if (typeDef.type.kind === 'enum') {
      let variants = typeDef.type.variants.map((variant) => {
        const name = camelCase(variant.name);
        if (variant.fields === undefined) {
          return borsh.struct([], name);
        }
        const fieldLayouts = variant.fields.map((f) => {
          if (!f.hasOwnProperty('name')) {
            throw new Error('Tuple enum variants not yet implemented.');
          }
          // this typescript conversion is ok
          // because if f were of type IdlType
          // (that does not have a name property)
          // the check before would've errored
          return IdlCoder.fieldLayout(f, types);
        });
        return borsh.struct(fieldLayouts, name);
      });

      if (name !== undefined) {
        // Buffer-layout lib requires the name to be null (on construction)
        // when used as a field.
        return borsh.rustEnum(variants).replicate(name);
      }

      return borsh.rustEnum(variants, name);
    } else {
      throw new Error(`Unknown type kint: ${typeDef}`);
    }
  }
}
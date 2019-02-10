# composite-object

A module for mapping between multi-part string keys and values

## Install

```
npm install composite-object
```

## Usage

```js
const { CompositeObject } = require("composite-object");
const map = new CompositeObject();
map.set(["a", "b", "c"], "test-value");
map.get(["a", "b", "c"]);
//=> 'test-value'
```

## API

### new CompositeObject([entries, [options]])

#### entries

Type: `CompositeObject` `Object`

Properties to populate the CompositeObject with. `Object` inputs must be in the same form as those created by the
[CompositeObject.prototype.toJSON\(\)](#compositeobjectprototypetojson) method.

```js
const compositeObject1 = new CompositeObject();
const compositeObject2 = new CompositeObject(compositeObject1);
const compositeObject3 = new CompositeObject({ a: "test-value", b: "test-value-2" }, { keyLength: 1 });
const compositeObject4 = new CompositeObject({ a: { b: "test-value" } }, { keyLength: 2 });
const compositeObject4 = new CompositeObject({ a: { b: { c: "test-value" } } }, { keyLength: 3 });
```

#### options

Type: `Object`

##### copy

Type: `"reference"` `"on-write"` `"keys"`<br>
Default: `"keys"`

Determines when the keys for the provided `CompositeObject` or `Object` are copied.

###### `"reference"`

Never copy keys. Changes made will affect the source. Only supported for copying an `Object`.

###### `"on-write"`

Copy keys as changes are made.

###### `"keys"`

Copy all keys immediately.

##### keyLength

Type: `number`

Manually specify the length of keys. Only used when constructing using an `Object`.

### CompositeObject.prototype.clear()

Removes all key/value pairs from the `CompositeObject`.

### CompositeObject.prototype.delete(key)

Returns `true` if a property in the `CompositeObject` existed and has been removed, or `false` if the property does
not exist.

#### key

Type: `string[]`

The key of the property to be deleted. Shorter keys will delete all properties with matching keys.

### CompositeObject.prototype.entries()

Returns a new `Iterator` object that contains an array of `[key, value]` for each property in the `CompositeObject`.

### CompositeObject.prototype.forEach(callbackFn)

Calls callbackFn once for each property present in the `CompositeObject`.

### CompositeObject.prototype.get(key)

Returns the value associated to the `key`, or `undefined` if there is none.

#### key

Type: `string[]`

The `key` of the property to be returned. Shorter keys will return the `Object` associated to the key if one exists.

### CompositeObject.prototype.has(key)

Returns a boolean asserting whether a value has been associated to the `key` in the `CompositeObject` or not.

#### key

Type: `string[]`

The `key` of the property to be found. Shorter keys will find any properties with matching keys.

### CompositeObject.prototype.keys()

Returns a new `Iterator` object that contains the keys for each property in the `CompositeObject`.

### CompositeObject.prototype.set(key, value)

Sets the value of the `key` in the `CompositeObject`. Returns the `CompositeObject`.

#### key

Type: `string[]`

The `key` to set the value for. All keys must have the same `Array` length.

#### value

Type: `any`

The value to store.

### CompositeObject.prototype.toJSON()

Returns a tree-like `Object` structure containing all properties in the `CompositeObject`.

```js
const compositeObject = new CompositeObject();
compositeObject.set(["a", "b", "c"], "test-value");
const json = JSON.stringify(compositeObject);
console.log(json);
//=>{ "a": { "b": { "c": "test-value" } } }
const compositeObject2 = new CompositeObject(JSON.parse(json), { keyLength: 3 });
```

### CompositeObject.prototype.values()

Returns a new `Iterator` object that contains the values for each property in the `CompositeObject`.

### CompositeObject.prototype\[@@iterator\]()

Returns a new `Iterator` object that contains an array of `[key, value]` for each property in the `CompositeObject`.

## TypeScript

To provide better typing support, you can import copies of the `CompositeObject` class typed for the length of `key`
being used.

```ts
import { CompositeObject3 } from "composite-object";
enum StringEnum {
    One = "one",
    Two = "two",
}
const compositeObject = new CompositeObject3<string, "a" | "b", MyStringEnum, string>();
compositeObject.set(["key-part", "a", MyStringEnum.One], "test-value");
const value: string = compositeObject.get(["key-part", "a", MyStringEnum.One]);
const subObject: Record<MyStringEnum, string> = compositeObject.get(["key-part", "a"]);
```

## Related

-   [composite-map](https://github.com/WesVanVugt/composite-map) - A module for mapping between multi-part keys and values.
-   [json-key-map](https://github.com/WesVanVugt/json-key-map) - A module for mapping between JSON keys and values.

## License

[MIT](https://github.com/WesVanVugt/composite-object/blob/master/license)

## Sources

Some text from this readme was sourced from [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

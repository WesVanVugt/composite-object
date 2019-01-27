"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: Symbols are not supported because they do not interate with other properties, which also affects pruning
//   performance.
class CompositeObject {
    constructor(entries, options) {
        if (!entries) {
            this.copiedSet = undefined;
            this.keyLength = 0;
            this.data = {};
        }
        else if (entries instanceof CompositeObject) {
            const copyMethod = (options && options.copy) || "keys";
            switch (copyMethod) {
                case "keys":
                    this.copiedSet = undefined;
                    this.keyLength = entries.keyLength;
                    this.data = copyMaps(entries.data, entries.keyLength, 0);
                    break;
                case "on-write":
                    // When using copy-on-write, map being copied must also use copy-on-write mode
                    entries.copiedSet = new WeakSet();
                    this.copiedSet = new WeakSet();
                case "reference":
                    this.keyLength = entries.keyLength;
                    this.data = entries.data;
                    break;
                default:
                    throw new Error(`Unrecognized copy method '${copyMethod}'`);
            }
        }
        else {
            this.keyLength = (options && options.keyLength) || 0;
            if (!this.keyLength) {
                throw new Error("Object inputs require a non-zero value for options.keyLength");
            }
            const copyMethod = (options && options.copy) || "keys";
            switch (copyMethod) {
                case "on-write":
                    this.copiedSet = new WeakSet();
                    this.data = entries;
                    break;
                case "reference":
                    this.copiedSet = undefined;
                    this.data = entries;
                    break;
                case "keys":
                    this.copiedSet = undefined;
                    this.data = copyRecursiveObject(this.keyLength - 1, entries, 0);
                    break;
                default:
                    throw new Error(`Unrecognized copy method '${copyMethod}'`);
            }
        }
    }
    set(key, value) {
        if (key.length !== this.keyLength) {
            if (!this.keyLength) {
                this.keyLength = key.length;
            }
            else {
                throw Error("Invalid key length");
            }
        }
        let obj = this.data;
        if (this.copiedSet && !this.copiedSet.has(obj)) {
            this.data = obj = Object.assign({}, obj);
            this.copiedSet.add(obj);
        }
        const lastPartIndex = key.length - 1;
        for (let i = 0; i < lastPartIndex; i++) {
            const keyPart = key[i];
            let nextObj = obj[keyPart];
            if (!nextObj) {
                nextObj = {};
                obj[keyPart] = nextObj;
                if (this.copiedSet) {
                    this.copiedSet.add(nextObj);
                }
            }
            else if (this.copiedSet && !this.copiedSet.has(nextObj)) {
                nextObj = Object.assign({}, nextObj);
                this.copiedSet.add(nextObj);
                obj[keyPart] = nextObj;
            }
            obj = nextObj;
        }
        obj[key[lastPartIndex]] = value;
        return this;
    }
    clear() {
        this.data = {};
        this.keyLength = 0;
    }
    delete(key) {
        if (!this.keyLength) {
            return false;
        }
        if (!key.length) {
            if (!hasProps(this.data)) {
                return false;
            }
            this.clear();
            return true;
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let obj = this.data;
        const objs = [obj];
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            obj = obj[key[i]];
            if (!obj) {
                return false;
            }
            objs[i + 1] = obj;
        }
        if (!obj.hasOwnProperty(key[lastKeyPos])) {
            return false;
        }
        // Prune the tree
        let deletePoint = lastKeyPos;
        for (; deletePoint > 0; deletePoint--) {
            obj = objs[deletePoint];
            if (hasOtherProps(obj, key[deletePoint])) {
                // Every map has been checked that the corresponding key is present, so if there is only
                // one element, it must belong to the key we are removing.
                break;
            }
        }
        if (this.copiedSet) {
            let prevObj;
            for (let i = 0; i <= deletePoint; i++) {
                obj = objs[i];
                if (!this.copiedSet.has(obj)) {
                    obj = Object.assign({}, obj);
                    this.copiedSet.add(obj);
                    if (i === 0) {
                        this.data = obj;
                    }
                    else {
                        prevObj[key[i - 1]] = obj;
                    }
                }
                prevObj = obj;
            }
        }
        else {
            obj = objs[deletePoint];
        }
        delete obj[key[deletePoint]];
        return true;
    }
    has(key) {
        if (!this.keyLength) {
            return false;
        }
        if (!key.length) {
            return hasProps(this.data);
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let obj = this.data;
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            obj = obj[key[i]];
            if (!obj) {
                return false;
            }
        }
        return obj.hasOwnProperty(key[lastKeyPos]);
    }
    get(key) {
        if (!key.length) {
            return this.data;
        }
        if (!this.keyLength) {
            return undefined;
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let obj = this.data;
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            obj = obj[key[i]];
            if (!obj) {
                return undefined;
            }
        }
        return obj[key[lastKeyPos]];
    }
    entries() {
        return recurseEntries(this.keyLength - 1, 0, [], this.data);
    }
    keys() {
        return recurseKeys(this.keyLength - 1, 0, [], this.data);
    }
    values() {
        return recurseValues(this.keyLength - 1, 0, this.data);
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    forEach(callbackfn) {
        if (callbackfn.length < 2) {
            recurseForEachValue(callbackfn, this.keyLength - 1, this.data, 0);
        }
        else {
            recurseForEach(callbackfn, this.keyLength - 1, this.data, [], 0);
        }
    }
    toJSON() {
        return this.data;
    }
}
exports.CompositeObject = CompositeObject;
// tslint:disable:variable-name
exports.CompositeObject1 = CompositeObject;
exports.CompositeObject2 = CompositeObject;
exports.CompositeObject3 = CompositeObject;
exports.CompositeObject4 = CompositeObject;
exports.CompositeObject5 = CompositeObject;
exports.CompositeObject6 = CompositeObject;
exports.CompositeObject7 = CompositeObject;
exports.CompositeObject8 = CompositeObject;
exports.CompositeObject9 = CompositeObject;
// tslint:enable:variable-name
function hasOtherProps(obj, prop) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== prop) {
            return true;
        }
    }
    return false;
}
function hasProps(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}
function copyMaps(map, keyLength, level) {
    if (level >= keyLength - 1) {
        return Object.assign({}, map);
    }
    const mapCopy = {};
    for (const key in map) {
        if (map.hasOwnProperty(key)) {
            mapCopy[key] = copyMaps(map[key], keyLength, level + 1);
        }
    }
    return mapCopy;
}
function recurseForEach(callbackfn, lastKeyPos, obj, keyPart, keyPos) {
    if (keyPos === lastKeyPos) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const key2 = keyPart.slice();
                key2[keyPos] = key;
                callbackfn(obj[key], key2);
            }
        }
    }
    else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                keyPart[keyPos] = key;
                recurseForEach(callbackfn, lastKeyPos, obj[key], keyPart, keyPos + 1);
            }
        }
    }
}
function recurseForEachValue(callbackfn, lastKeyPos, obj, keyPos) {
    if (keyPos === lastKeyPos) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                callbackfn(obj[key]);
            }
        }
    }
    else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                recurseForEachValue(callbackfn, lastKeyPos, obj[key], keyPos + 1);
            }
        }
    }
}
function copyRecursiveObject(lastKeyPos, obj, level) {
    const objCopy = {};
    let keyElement;
    if (level >= lastKeyPos) {
        for (keyElement in obj) {
            if (obj.hasOwnProperty(keyElement)) {
                objCopy[keyElement] = obj[keyElement];
            }
        }
    }
    else {
        for (keyElement in obj) {
            if (obj.hasOwnProperty(keyElement)) {
                objCopy[keyElement] = copyRecursiveObject(lastKeyPos, obj[keyElement], level + 1);
            }
        }
    }
    return objCopy;
}
function* recurseEntries(lastKeyIndex, keyIndex, key, obj) {
    let keyPart;
    if (keyIndex >= lastKeyIndex) {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                const keyCopy = key.slice();
                keyCopy[keyIndex] = keyPart;
                yield [keyCopy, obj[keyPart]];
            }
        }
    }
    else {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                key[keyIndex] = keyPart;
                yield* recurseEntries(lastKeyIndex, keyIndex + 1, key, obj[keyPart]);
            }
        }
    }
}
function* recurseKeys(lastKeyIndex, keyIndex, key, obj) {
    let keyPart;
    if (keyIndex >= lastKeyIndex) {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                const keyCopy = key.slice();
                keyCopy[keyIndex] = keyPart;
                yield keyCopy;
            }
        }
    }
    else {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                key[keyIndex] = keyPart;
                yield* recurseKeys(lastKeyIndex, keyIndex + 1, key, obj[keyPart]);
            }
        }
    }
}
function* recurseValues(lastKeyIndex, keyIndex, obj) {
    let keyPart;
    if (keyIndex >= lastKeyIndex) {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                yield obj[keyPart];
            }
        }
    }
    else {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                yield* recurseValues(lastKeyIndex, keyIndex + 1, obj[keyPart]);
            }
        }
    }
}

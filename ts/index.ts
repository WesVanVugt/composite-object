export type RecursiveObject<K extends string, V> = { [P in K]?: RecursiveObject<K, V> | V };

export type CompositeObjectCopyMethod = "reference" | "on-write" | "keys";

export interface CompositeObjectOptions {
    /**
     * Indicates when CompositeObject or RecursiveObject key data passed to the constructor is copied.
     * * "reference": Never copy key data, referencing the original data instead. The most performant option. Only
     * supported for copying a RecursiveObject.
     * * "on-write": Copy the data as necessary when changes are made. Incurs a performance pentalty, but preserves
     * the original data.
     * * "keys": Copy the key data. More performant than "on-write" when there are few entries, but less performant
     * when there are many. This is the default option.
     */
    copy?: CompositeObjectCopyMethod;
    /**
     * Indicates the length of the key for this map. Only used when constructing using a RecursiveObject since the
     * key-length cannot be inferred.
     */
    keyLength?: number;
}

// NOTE: Symbols are not supported because they do not interate with other properties, which also affects pruning
//   performance.
export class CompositeObject<K extends string, V> {
    private data: RecursiveObject<K, V>;
    private keyLength: number;
    private copiedSet?: WeakSet<RecursiveObject<K, V>>;

    constructor();
    constructor(entries: CompositeObject<K, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject<K, V>, options: CompositeObjectOptions & { keyLength: number });
    constructor(entries?: CompositeObject<K, V> | RecursiveObject<K, V>, options?: CompositeObjectOptions) {
        if (!entries) {
            this.copiedSet = undefined;
            this.keyLength = 0;
            this.data = {};
        } else if (entries instanceof CompositeObject) {
            const copyMethod: CompositeObjectCopyMethod = (options && options.copy) || "keys";
            switch (copyMethod) {
                case "keys":
                    this.copiedSet = undefined;
                    this.keyLength = entries.keyLength;
                    this.data = copyMaps(entries.data, entries.keyLength, 0);
                    break;
                case "on-write":
                    // When using copy-on-write, map being copied must also use copy-on-write mode
                    this.copiedSet = entries.copiedSet = new WeakSet();
                    this.keyLength = entries.keyLength;
                    this.data = entries.data;
                    break;
                case "reference":
                    throw new Error(`Copy method '${copyMethod}' is not supported when copying CompositeObject`);
                default:
                    throw new Error(`Unrecognized copy method '${copyMethod}'`);
            }
        } else {
            this.keyLength = (options && options.keyLength) || 0;
            if (!this.keyLength) {
                throw new Error("Object inputs require a non-zero value for options.keyLength");
            }
            const copyMethod: CompositeObjectCopyMethod = (options && options.copy) || "keys";
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

    public set(key: K[], value: V): this {
        if (key.length !== this.keyLength) {
            if (!this.keyLength) {
                this.keyLength = key.length;
            } else {
                throw Error("Invalid key length");
            }
        }
        let obj: RecursiveObject<K, V> = this.data;
        if (this.copiedSet && !this.copiedSet.has(obj)) {
            this.data = obj = { ...obj };
            this.copiedSet.add(obj);
        }
        const lastPartIndex = key.length - 1;
        for (let i = 0; i < lastPartIndex; i++) {
            const keyPart = key[i];
            let nextObj = obj[keyPart] as RecursiveObject<K, V>;
            if (!nextObj) {
                nextObj = {};
                obj[keyPart] = nextObj;
                if (this.copiedSet) {
                    this.copiedSet.add(nextObj);
                }
            } else if (this.copiedSet && !this.copiedSet.has(nextObj)) {
                nextObj = { ...nextObj };
                this.copiedSet.add(nextObj);
                obj[keyPart] = nextObj;
            }
            obj = nextObj;
        }
        obj[key[lastPartIndex]] = value;
        return this;
    }

    public clear(): void {
        this.data = {};
        this.copiedSet = undefined;
        this.keyLength = 0;
    }

    public delete(key: K[]): boolean {
        if (!this.keyLength) {
            this.clear();
            return false;
        }
        if (!key.length) {
            if (!hasProps(this.data)) {
                this.clear();
                return false;
            }
            this.clear();
            return true;
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let obj = this.data;
        const objs: Array<RecursiveObject<K, V>> = [obj];
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            obj = obj[key[i]] as RecursiveObject<K, V>;
            if (!obj) {
                return false;
            }
            objs[i + 1] = obj;
        }
        if (!obj.hasOwnProperty(key[lastKeyPos])) {
            return false;
        }
        // Prune the tree
        let deletePoint: number = lastKeyPos;
        for (; deletePoint > 0; deletePoint--) {
            obj = objs[deletePoint];
            if (hasOtherProps(obj, key[deletePoint])) {
                // Every map has been checked that the corresponding key is present, so if there is only
                // one element, it must belong to the key we are removing.
                break;
            }
        }
        if (this.copiedSet) {
            let prevObj!: RecursiveObject<K, V>;

            for (let i = 0; i <= deletePoint; i++) {
                obj = objs[i];
                if (!this.copiedSet.has(obj)) {
                    obj = { ...obj };
                    this.copiedSet.add(obj);
                    if (i === 0) {
                        this.data = obj;
                    } else {
                        prevObj[key[i - 1]] = obj;
                    }
                }
                prevObj = obj;
            }
        } else {
            obj = objs[deletePoint];
        }
        delete obj[key[deletePoint]];
        return true;
    }

    public has(key: K[]): boolean {
        if (!this.keyLength) {
            return false;
        }
        if (!key.length) {
            return hasProps(this.data);
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let obj: RecursiveObject<K, V> = this.data;
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            obj = obj[key[i]] as RecursiveObject<K, V>;
            if (!obj) {
                return false;
            }
        }
        return obj.hasOwnProperty(key[lastKeyPos]);
    }

    public get(key: K[]): V | RecursiveObject<K, V> | undefined {
        if (!key.length) {
            return this.data;
        }
        if (!this.keyLength) {
            return undefined;
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let obj: RecursiveObject<K, V> = this.data;
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            obj = obj[key[i]] as RecursiveObject<K, V>;
            if (!obj) {
                return undefined;
            }
        }
        return obj[key[lastKeyPos]];
    }

    public entries(): IterableIterator<[K[], V]> {
        return recurseEntries(this.keyLength - 1, 0, [], this.data);
    }

    public keys(): IterableIterator<K[]> {
        return recurseKeys(this.keyLength - 1, 0, [], this.data);
    }

    public values(): IterableIterator<V> {
        return recurseValues(this.keyLength - 1, 0, this.data);
    }

    public [Symbol.iterator](): IterableIterator<[K[], V]> {
        return this.entries();
    }

    public forEach(callbackfn: (value: V, key: K[]) => void): void {
        if (callbackfn.length < 2) {
            recurseForEachValue(callbackfn as (value: V) => void, this.keyLength - 1, this.data, 0);
        } else {
            recurseForEach(callbackfn, this.keyLength - 1, this.data, [], 0);
        }
    }

    public toJSON(): RecursiveObject<K, V> {
        return this.data;
    }
}
// tslint:disable:variable-name
export const CompositeObject1 = CompositeObject;
export const CompositeObject2 = CompositeObject;
export const CompositeObject3 = CompositeObject;
export const CompositeObject4 = CompositeObject;
export const CompositeObject5 = CompositeObject;
export const CompositeObject6 = CompositeObject;
export const CompositeObject7 = CompositeObject;
export const CompositeObject8 = CompositeObject;
export const CompositeObject9 = CompositeObject;
// tslint:enable:variable-name

function hasOtherProps(obj: object, prop: string): boolean {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== prop) {
            return true;
        }
    }
    return false;
}

function hasProps(obj: object): boolean {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}

function copyMaps<K extends string, V>(
    map: RecursiveObject<K, V>,
    keyLength: number,
    level: number,
): RecursiveObject<K, V> {
    if (level >= keyLength - 1) {
        return { ...map };
    }
    const mapCopy: RecursiveObject<K, V> = {};
    for (const key in map) {
        if (map.hasOwnProperty(key)) {
            mapCopy[key] = copyMaps(map[key] as RecursiveObject<K, V>, keyLength, level + 1);
        }
    }
    return mapCopy;
}

function recurseForEach<K extends string, V>(
    callbackfn: (value: V, key: K[]) => void,
    lastKeyPos: number,
    obj: RecursiveObject<K, V>,
    keyPart: K[],
    keyPos: number,
): void {
    if (keyPos === lastKeyPos) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const key2 = keyPart.slice();
                key2[keyPos] = key;
                callbackfn(obj[key] as V, key2);
            }
        }
    } else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                keyPart[keyPos] = key;
                recurseForEach(callbackfn, lastKeyPos, obj[key] as RecursiveObject<K, V>, keyPart, keyPos + 1);
            }
        }
    }
}

function recurseForEachValue<K extends string, V>(
    callbackfn: (value: V) => void,
    lastKeyPos: number,
    obj: RecursiveObject<K, V>,
    keyPos: number,
): void {
    if (keyPos === lastKeyPos) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                callbackfn(obj[key] as V);
            }
        }
    } else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                recurseForEachValue(callbackfn, lastKeyPos, obj[key] as RecursiveObject<K, V>, keyPos + 1);
            }
        }
    }
}

function copyRecursiveObject<K extends string, V>(
    lastKeyPos: number,
    obj: RecursiveObject<K, V>,
    level: number,
): RecursiveObject<K, V> {
    const objCopy: RecursiveObject<K, V> = {};
    let keyElement: K;
    if (level >= lastKeyPos) {
        for (keyElement in obj) {
            if (obj.hasOwnProperty(keyElement)) {
                objCopy[keyElement] = obj[keyElement];
            }
        }
    } else {
        for (keyElement in obj) {
            if (obj.hasOwnProperty(keyElement)) {
                objCopy[keyElement] = copyRecursiveObject(
                    lastKeyPos,
                    obj[keyElement] as RecursiveObject<K, V>,
                    level + 1,
                );
            }
        }
    }
    return objCopy;
}

function* recurseEntries<K extends string, V>(
    lastKeyIndex: number,
    keyIndex: number,
    key: K[],
    obj: RecursiveObject<K, V>,
): IterableIterator<[K[], V]> {
    let keyPart: K;
    if (keyIndex >= lastKeyIndex) {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                const keyCopy = key.slice();
                keyCopy[keyIndex] = keyPart;
                yield [keyCopy, obj[keyPart] as V];
            }
        }
    } else {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                key[keyIndex] = keyPart;
                yield* recurseEntries(lastKeyIndex, keyIndex + 1, key, obj[keyPart] as RecursiveObject<K, V>);
            }
        }
    }
}

function* recurseKeys<K extends string, V>(
    lastKeyIndex: number,
    keyIndex: number,
    key: K[],
    obj: RecursiveObject<K, V>,
): IterableIterator<K[]> {
    let keyPart: K;
    if (keyIndex >= lastKeyIndex) {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                const keyCopy = key.slice();
                keyCopy[keyIndex] = keyPart;
                yield keyCopy;
            }
        }
    } else {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                key[keyIndex] = keyPart;
                yield* recurseKeys(lastKeyIndex, keyIndex + 1, key, obj[keyPart] as RecursiveObject<K, V>);
            }
        }
    }
}

function* recurseValues<K extends string, V>(
    lastKeyIndex: number,
    keyIndex: number,
    obj: RecursiveObject<K, V>,
): IterableIterator<V> {
    let keyPart: K;
    if (keyIndex >= lastKeyIndex) {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                yield obj[keyPart] as V;
            }
        }
    } else {
        for (keyPart in obj) {
            if (obj.hasOwnProperty(keyPart)) {
                yield* recurseValues(lastKeyIndex, keyIndex + 1, obj[keyPart] as RecursiveObject<K, V>);
            }
        }
    }
}

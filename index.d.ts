export declare type RecursiveObject<K extends string, V> = {
    [P in K]?: RecursiveObject<K, V> | V;
};
export declare type CompositeObjectCopyMethod = "reference" | "on-write" | "keys";
export interface CompositeObjectOptions {
    /**
     * Indicates when CompositeObject or RecursiveObject key data passed to the constructor is copied.
     * * "reference": Never copy key data, referencing the original data instead. The most performant option.
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
export declare class CompositeObject<K extends string, V> {
    private data;
    private keyLength;
    private copiedSet?;
    constructor();
    constructor(entries: CompositeObject<K, V> | CompositeObject1<any, V> | CompositeObject2<any, any, V> | CompositeObject3<any, any, any, V> | CompositeObject4<any, any, any, any, V> | CompositeObject5<any, any, any, any, any, V> | CompositeObject6<any, any, any, any, any, any, V> | CompositeObject7<any, any, any, any, any, any, any, V> | CompositeObject8<any, any, any, any, any, any, any, any, V> | CompositeObject9<any, any, any, any, any, any, any, any, any, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject<K, V>, options: CompositeObjectOptions & {
        keyLength: number;
    });
    set(key: K[], value: V): this;
    clear(): void;
    delete(key: K[]): boolean;
    has(key: K[]): boolean;
    get(key: K[]): V | RecursiveObject<K, V> | undefined;
    entries(): IterableIterator<[K[], V]>;
    keys(): IterableIterator<K[]>;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K[], V]>;
    forEach(callbackfn: (value: V, key: K[]) => void): void;
    toJSON(): RecursiveObject<K, V>;
}
export declare type RecursiveObject1<K1 extends string, V> = {
    [P in K1]?: V;
}
export declare type RecursiveObject2<K1 extends string, K2 extends string, V> = {
    [P in K1]?: RecursiveObject1<K2, V>;
};
export declare type RecursiveObject3<K1 extends string, K2 extends string, K3 extends string, V> = {
    [P in K1]?: RecursiveObject2<K2, K3, V>;
};
export declare type RecursiveObject4<K1 extends string, K2 extends string, K3 extends string, K4 extends string, V> = {
    [P in K1]?: RecursiveObject3<K2, K3, K4, V>;
};
export declare type RecursiveObject5<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, V> = {
    [P in K1]?: RecursiveObject4<K2, K3, K4, K5, V>;
};
export declare type RecursiveObject6<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, V> = {
    [P in K1]?: RecursiveObject5<K2, K3, K4, K5, K6, V>;
};
export declare type RecursiveObject7<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, K7 extends string, V> = {
    [P in K1]?: RecursiveObject6<K2, K3, K4, K5, K6, K7, V>;
};
export declare type RecursiveObject8<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, K7 extends string, K8 extends string, V> = {
    [P in K1]?: RecursiveObject7<K2, K3, K4, K5, K6, K7, K8, V>;
};
export declare type RecursiveObject9<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, K7 extends string, K8 extends string, K9 extends string, V> = {
    [P in K1]?: RecursiveObject8<K2, K3, K4, K5, K6, K7, K8, K9, V>;
};
export declare class CompositeObject1<K1 extends string, V> {
    constructor();
    constructor(entries: CompositeObject1<K1, V> | CompositeObject<K1, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject1<K1, V> | RecursiveObject<K1, V>, options: CompositeObjectOptions & { keyLength: 1 });
    set(key: [K1], value: V): this;
    clear(): void;
    delete(key: [K1] | []): boolean;
    has(key: [K1] | []): boolean;
    get(key: [K1]): V | undefined;
    get(key: []): RecursiveObject1<K1, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1]) => void): void;
    keys(): IterableIterator<[K1]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1], V]>;
    [Symbol.iterator](): IterableIterator<[[K1], V]>;
    toJSON(): RecursiveObject1<K1, V>;
}
export declare class CompositeObject2<K1 extends string, K2 extends string, V> {
    constructor();
    constructor(entries: CompositeObject2<K1, K2, V> | CompositeObject<K1 | K2, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject2<K1, K2, V> | RecursiveObject<K1 | K2, V>, options: CompositeObjectOptions & { keyLength: 2 });
    set(key: [K1, K2], value: V): this;
    clear(): void;
    delete(key: [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2]): V | undefined;
    get(key: [K1]): RecursiveObject1<K2, V> | undefined;
    get(key: []): RecursiveObject2<K1, K2, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2]) => void): void;
    keys(): IterableIterator<[K1, K2]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2], V]>;
    toJSON(): RecursiveObject2<K1, K2, V>;
}
export declare class CompositeObject3<K1 extends string, K2 extends string, K3 extends string, V> {
    constructor();
    constructor(entries: CompositeObject3<K1, K2, K3, V> | CompositeObject<K1 | K2 | K3, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject3<K1, K2, K3, V> | RecursiveObject<K1 | K2 | K3, V>, options: CompositeObjectOptions & { keyLength: 3 });
    set(key: [K1, K2, K3], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3]): V | undefined;
    get(key: [K1, K2]): RecursiveObject1<K3, V> | undefined;
    get(key: [K1]): RecursiveObject2<K2, K3, V> | undefined;
    get(key: []): RecursiveObject3<K1, K2, K3, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3]) => void): void;
    keys(): IterableIterator<[K1, K2, K3]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3], V]>;
    toJSON(): RecursiveObject3<K1, K2, K3, V>;
}
export declare class CompositeObject4<K1 extends string, K2 extends string, K3 extends string, K4 extends string, V> {
    constructor();
    constructor(entries: CompositeObject4<K1, K2, K3, K4, V> | CompositeObject<K1 | K2 | K3 | K4, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject4<K1, K2, K3, K4, V> | RecursiveObject<K1 | K2 | K3 | K4, V>, options: CompositeObjectOptions & { keyLength: 4 });
    set(key: [K1, K2, K3, K4], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4]): V | undefined;
    get(key: [K1, K2, K3]): RecursiveObject1<K4, V> | undefined;
    get(key: [K1, K2]): RecursiveObject2<K3, K4, V> | undefined;
    get(key: [K1]): RecursiveObject3<K2, K3, K4, V> | undefined;
    get(key: []): RecursiveObject4<K1, K2, K3, K4, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4], V]>;
    toJSON(): RecursiveObject4<K1, K2, K3, K4, V>;
}
export declare class CompositeObject5<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, V> {
    constructor();
    constructor(entries: CompositeObject5<K1, K2, K3, K4, K5, V> | CompositeObject<K1 | K2 | K3 | K4 | K5, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject5<K1, K2, K3, K4, K5, V> | RecursiveObject<K1 | K2 | K3 | K4 | K5, V>, options: CompositeObjectOptions & { keyLength: 5 });
    set(key: [K1, K2, K3, K4, K5], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5]): V | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveObject1<K5, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveObject2<K4, K5, V> | undefined;
    get(key: [K1, K2]): RecursiveObject3<K3, K4, K5, V> | undefined;
    get(key: [K1]): RecursiveObject4<K2, K3, K4, K5, V> | undefined;
    get(key: []): RecursiveObject5<K1, K2, K3, K4, K5, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5], V]>;
    toJSON(): RecursiveObject5<K1, K2, K3, K4, K5, V>;
}
export declare class CompositeObject6<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, V> {
    constructor();
    constructor(entries: CompositeObject6<K1, K2, K3, K4, K5, K6, V> | CompositeObject<K1 | K2 | K3 | K4 | K5 | K6, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject6<K1, K2, K3, K4, K5, K6, V> | RecursiveObject<K1 | K2 | K3 | K4 | K5 | K6, V>, options: CompositeObjectOptions & { keyLength: 6 });
    set(key: [K1, K2, K3, K4, K5, K6], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6]): V | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveObject1<K6, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveObject2<K5, K6, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveObject3<K4, K5, K6, V> | undefined;
    get(key: [K1, K2]): RecursiveObject4<K3, K4, K5, K6, V> | undefined;
    get(key: [K1]): RecursiveObject5<K2, K3, K4, K5, K6, V> | undefined;
    get(key: []): RecursiveObject6<K1, K2, K3, K4, K5, K6, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6], V]>;
    toJSON(): RecursiveObject6<K1, K2, K3, K4, K5, K6, V>;
}
export declare class CompositeObject7<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, K7 extends string, V> {
    constructor();
    constructor(entries: CompositeObject7<K1, K2, K3, K4, K5, K6, K7, V> | CompositeObject<K1 | K2 | K3 | K4 | K5 | K6 | K7, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject7<K1, K2, K3, K4, K5, K6, K7, V> | RecursiveObject<K1 | K2 | K3 | K4 | K5 | K6 | K7, V>, options: CompositeObjectOptions & { keyLength: 7 });
    set(key: [K1, K2, K3, K4, K5, K6, K7], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6, K7]): V | undefined;
    get(key: [K1, K2, K3, K4, K5, K6]): RecursiveObject1<K7, V> | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveObject2<K6, K7, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveObject3<K5, K6, K7, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveObject4<K4, K5, K6, K7, V> | undefined;
    get(key: [K1, K2]): RecursiveObject5<K3, K4, K5, K6, K7, V> | undefined;
    get(key: [K1]): RecursiveObject6<K2, K3, K4, K5, K6, K7, V> | undefined;
    get(key: []): RecursiveObject7<K1, K2, K3, K4, K5, K6, K7, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6, K7]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6, K7]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7], V]>;
    toJSON(): RecursiveObject7<K1, K2, K3, K4, K5, K6, K7, V>;
}
export declare class CompositeObject8<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, K7 extends string, K8 extends string, V> {
    constructor();
    constructor(entries: CompositeObject8<K1, K2, K3, K4, K5, K6, K7, K8, V> | CompositeObject<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject8<K1, K2, K3, K4, K5, K6, K7, K8, V> | RecursiveObject<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8, V>, options: CompositeObjectOptions & { keyLength: 8 });
    set(key: [K1, K2, K3, K4, K5, K6, K7, K8], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6, K7, K8]): V | undefined;
    get(key: [K1, K2, K3, K4, K5, K6, K7]): RecursiveObject1<K8, V> | undefined;
    get(key: [K1, K2, K3, K4, K5, K6]): RecursiveObject2<K7, K8, V> | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveObject3<K6, K7, K8, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveObject4<K5, K6, K7, K8, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveObject5<K4, K5, K6, K7, K8, V> | undefined;
    get(key: [K1, K2]): RecursiveObject6<K3, K4, K5, K6, K7, K8, V> | undefined;
    get(key: [K1]): RecursiveObject7<K2, K3, K4, K5, K6, K7, K8, V> | undefined;
    get(key: []): RecursiveObject8<K1, K2, K3, K4, K5, K6, K7, K8, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6, K7, K8]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6, K7, K8]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8], V]>;
    toJSON(): RecursiveObject8<K1, K2, K3, K4, K5, K6, K7, K8, V>;
}
export declare class CompositeObject9<K1 extends string, K2 extends string, K3 extends string, K4 extends string, K5 extends string, K6 extends string, K7 extends string, K8 extends string, K9 extends string, V> {
    constructor();
    constructor(entries: CompositeObject9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> | CompositeObject<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9, V>, options?: CompositeObjectOptions);
    constructor(entries: RecursiveObject9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> | RecursiveObject<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9, V>, options: CompositeObjectOptions & { keyLength: 9 });
    set(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9] | [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9] | [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9]): V | undefined;
    get(key: [K1, K2, K3, K4, K5, K6, K7, K8]): RecursiveObject1<K9, V> | undefined;
    get(key: [K1, K2, K3, K4, K5, K6, K7]): RecursiveObject2<K8, K9, V> | undefined;
    get(key: [K1, K2, K3, K4, K5, K6]): RecursiveObject3<K7, K8, K9, V> | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveObject4<K6, K7, K8, K9, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveObject5<K5, K6, K7, K8, K9, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveObject6<K4, K5, K6, K7, K8, K9, V> | undefined;
    get(key: [K1, K2]): RecursiveObject7<K3, K4, K5, K6, K7, K8, K9, V> | undefined;
    get(key: [K1]): RecursiveObject8<K2, K3, K4, K5, K6, K7, K8, K9, V> | undefined;
    get(key: []): RecursiveObject9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6, K7, K8, K9]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6, K7, K8, K9]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8, K9], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8, K9], V]>;
    toJSON(): RecursiveObject9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V>;
}
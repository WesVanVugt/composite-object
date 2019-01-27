import { expect } from "chai";
import { CompositeObject, RecursiveObject } from "./imports";

function jsonClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

describe("CompositeObject", () => {
    before(() => {
        // Don't try this at home
        (Object.prototype as any).__bad = true;
    });

    it(".prototype.get(key)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        expect(map.get(["a", "b"])).to.equal("test");
        expect(map.get(["b", "a"])).to.equal("test2");
        expect(map.get(["a", "c"])).to.equal(undefined);
    });

    it(".prototype.has(key)", () => {
        const map = new CompositeObject<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        expect(map.has(["a", "c"])).to.equal(false);
    });

    it(".prototype.delete(key)", () => {
        const map = new CompositeObject<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        expect(map.delete(["a", "c"])).to.equal(false);
        expect(map.delete(["a", "b"])).to.equal(true);
        expect(map.has(["a", "b"])).to.equal(false);
        expect(map.delete(["a", "b"])).to.equal(false);
    });

    it(".prototype.clear()", () => {
        const map = new CompositeObject<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        map.clear();
        expect(map.has(["a", "b"])).to.equal(false);
    });

    it(".prototype.forEach((value, key) => {})", () => {
        const map = new CompositeObject<string, string>();
        map.set(["b", "a"], "test").set(["a", "b"], "test2");
        const output: Array<[string[], string]> = [];

        map.forEach((value, key) => {
            output.push([key, value]);
        });
        expect(output).to.deep.equal([[["b", "a"], "test"], [["a", "b"], "test2"]]);
    });

    // To improve performance, if the key parameter is not accepted, separate code is run to avoid calculating the key
    it(".prototype.forEach((value) => {})", () => {
        const map = new CompositeObject<string, string>();
        map.set(["b", "a"], "test").set(["a", "b"], "test2");
        const output: string[] = [];

        map.forEach((value) => {
            output.push(value);
        });
        expect(output).to.deep.equal(["test", "test2"]);
    });

    it(".prototype.entries() / .prototype[@@iterator]()", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map)).to.deep.equal([[["a", "a", "a"], "test"], [["b", "a", "a"], "test2"]]);
        expect(Array.from(map.entries())).to.deep.equal([[["a", "a", "a"], "test"], [["b", "a", "a"], "test2"]]);
    });

    it(".prototype.keys()", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map.keys())).to.deep.equal([["a", "a", "a"], ["b", "a", "a"]]);
        map.clear();
        map.set(["a"], "test").set(["b"], "test2");
        expect(Array.from(map.keys())).to.deep.equal([["a"], ["b"]]);
    });

    it(".prototype.values()", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map.values())).to.deep.equal(["test", "test2"]);
    });

    it("constructor(map)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test");
        const mapCopy = new CompositeObject(map);
        expect(mapCopy.get(["a", "b"])).to.equal("test");
    });

    it(".prototype.set(long_key)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.set(["c", "d", "e"], "test2")).to.throw(/^Invalid key length$/);
    });

    it(".prototype.delete(long_key)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.delete(["c", "d", "e"])).to.throw(/^Invalid key length$/);
    });

    it(".prototype.has(long_key)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.has(["c", "d", "e"])).to.throw(/^Invalid key length$/);
    });

    it(".prototype.get(long_key)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.get(["c", "d", "e"])).to.throw(/^Invalid key length$/);
    });

    it(".prototype.has(short_key)", () => {
        const map = new CompositeObject<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a"])).to.equal(true);
        expect(map.has(["b"])).to.equal(false);
    });

    it(".prototype.has(zero_length_key)", () => {
        const map = new CompositeObject<string, boolean>();
        expect(map.has([])).to.equal(false);
        map.set(["a", "b"], true);
        expect(map.has([])).to.equal(true);
    });

    it(".prototype.delete(short_key)", () => {
        const map = new CompositeObject<string, boolean>();
        map.set(["a", "b"], true).set(["a", "c"], true);
        expect(map.delete(["a"])).to.equal(true);
        expect(map.get(["a", "b"])).to.equal(undefined);
        expect(map.get(["a", "c"])).to.equal(undefined);
    });

    it(".prototype.delete(zero_length_key)", () => {
        const map = new CompositeObject<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.delete([])).to.equal(true);
        expect(map.get(["a", "b"])).to.equal(undefined);
        expect(map.delete([])).to.equal(false);

        // Try deleting root when the keyLength is non-zero
        map.set(["a", "b"], true).delete(["a", "b"]);
        expect(map.delete([])).to.equal(false);
    });

    it('constructor(map, { copy: "on-write" }), .prototype.set(key, value)', () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test")
            .set(["b", "a"], "test2")
            .set(["c", "a"], "test3");
        expect((map as any).copiedSet).to.equal(undefined);
        const mapCopy = new CompositeObject(map, { copy: "on-write" });

        // Both the original and the copy should have a copiedSet
        expect((map as any).copiedSet).to.be.a("WeakSet");
        expect((mapCopy as any).copiedSet).to.be.a("WeakSet");
        expect(mapCopy.get(["a", "b"])).to.equal("test");
        expect(mapCopy.get([])).to.equal(map.get([]), "The unmodified copy should use the same root map object");

        mapCopy.set(["a", "b"], "test4");
        expect(mapCopy.get(["a", "b"])).to.equal("test4");
        expect(map.get(["a", "b"])).to.equal("test", "The original map should remain unchanged");
        const newRootMap = mapCopy.get([]);
        expect(newRootMap).to.not.equal(map.get([]), "Changes should result in the root map being duplicated");
        expect(mapCopy.get(["b"])).to.equal(map.get(["b"]), "The unmodified sub-map should still be shared");

        mapCopy.set(["b", "a"], "test5");
        expect(mapCopy.get([])).to.equal(newRootMap, "Further changes should not result in excess duplication");

        map.set(["c", "a"], "test6");
        expect(mapCopy.get(["c", "a"])).to.equal("test3", "Changes to the original map should not affect the copy");

        const mapCopy2 = new CompositeObject(map, { copy: "on-write" });
        map.set(["d", "a"], "test7");
        expect(mapCopy2.get(["d", "a"])).to.equal(undefined);
    });

    it('constructor(map, { copy: "on-write" }), .prototype.delete(key)', () => {
        const map = new CompositeObject<string, string>();
        // Note: Unless a sub-map has multiple entries, pruning will cause the sub-map to remain unchanged since it
        //   would instead be deleted by its parent.
        map.set(["a", "a"], "test")
            .set(["a", "b"], "test2")
            .set(["b", "a"], "test3")
            .set(["b", "b"], "test4");
        const mapCopy = new CompositeObject(map, { copy: "on-write" });

        expect(mapCopy.get(["a", "a"])).to.equal("test");
        expect(mapCopy.get([])).to.equal(map.get([]), "The unmodified copy should use the same root map object");

        expect(mapCopy.delete(["a", "a"])).to.equal(true);
        expect(map.has(["a", "a"])).to.equal(true, "The original map should remain unchanged");
        const newRootMap = mapCopy.get([]);
        expect(newRootMap).to.not.equal(map.get([]), "Changes should result in the root map being duplicated");

        expect(mapCopy.delete(["a", "b"])).to.equal(true);
        expect(mapCopy.get([])).to.equal(newRootMap, "Further changes should not result in excess duplication");

        expect(mapCopy.get(["b"])).to.equal(map.get(["b"]), "The unmodified sub-map should still be shared");
        expect(map.delete(["b", "a"])).to.equal(true);
        expect(mapCopy.has(["b", "a"])).to.equal(true, "Changes to the original map should not affect the copy");
    });

    it('constructor(map, { copy: "keys" })', () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        // The default option is to copy the keys, so no options need to be set
        const mapCopy = new CompositeObject(map);

        expect((mapCopy as any).copiedSet).to.equal(undefined);
        expect(mapCopy.get(["a", "b"])).to.equal("test");
        expect(mapCopy.get([])).not.to.equal(map.get([]), "The unmodified copy should still have a different map");

        mapCopy.set(["a", "b"], "test3");
        expect(mapCopy.get(["a", "b"])).to.equal("test3");
        expect(map.get(["a", "b"])).to.equal("test", "The original map should remain unchanged");
    });

    it('constructor(map, { copy: "reference" })', () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        const mapCopy = new CompositeObject(map, { copy: "reference" });

        expect((mapCopy as any).copiedSet).to.equal(undefined);
        expect(mapCopy.get(["a", "b"])).to.equal("test");
        expect(mapCopy.get([])).to.equal(map.get([]), "The copy should use the same root map object");

        mapCopy.set(["a", "b"], "test3");
        expect(mapCopy.get(["a", "b"])).to.equal("test3");
        expect(map.get(["a", "b"])).to.equal("test3", "The original map should also be changed");
    });

    it('constructor(map, { copy: "invalid" })', () => {
        const map = new CompositeObject<string, string>();
        expect(() => new CompositeObject(map, { copy: "invalid" as any })).to.throw(
            /^Unrecognized copy method 'invalid'$/,
        );
    });

    it(".prototype.delete() [pruning]", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b", "c"], "test").set(["a", "c", "d"], "test2");

        expect(map.get(["a", "b"])).to.not.equal(undefined);
        map.delete(["a", "b", "c"]);
        expect(map.get(["a", "b"])).to.equal(undefined);

        expect(map.get(["a"])).to.not.equal(undefined);
        map.delete(["a", "c", "d"]);
        expect(map.get(["a"])).to.equal(undefined);
    });

    it(".prototype.get(short_key)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test");
        expect(map.get(["a"])).to.deep.equal({ b: "test" });
        expect(map.get(["b"])).to.equal(undefined);
    });

    it(".prototype.get(zero_length_key)", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test");
        expect(map.get([])).to.deep.equal({ a: { b: "test" } });
    });

    it(".prototype.toJSON()", () => {
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        const json = jsonClone(map);
        expect(json).to.deep.equal({
            a: { b: "test" },
            b: { a: "test2" },
        });
    });

    it('constructor(entries, { copy: "keys", length: 2 })', () => {
        const entries: RecursiveObject<string, string> = { a: { b: "test" }, b: { a: "test2" } };
        const entriesClone = jsonClone(entries);

        let map = new CompositeObject<string, string>(entriesClone, { copy: "keys", keyLength: 2 });
        expect(jsonClone(map)).to.deep.equal(entriesClone);

        map = new CompositeObject<string, string>(entriesClone, { keyLength: 2 });
        expect(jsonClone(map)).to.deep.equal(entriesClone);
        expect(entriesClone).to.deep.equal(entries);
    });

    it('constructor(entries, { copy: "on-write", length: 2 })', () => {
        const entries: RecursiveObject<string, string> = { a: { b: "test" }, b: { a: "test2" } };
        const entriesClone = jsonClone(entries);
        const map = new CompositeObject(entriesClone, { copy: "on-write", keyLength: 2 });
        expect(map.get([])).to.equal(entriesClone);
        map.set(["a", "b"], "test3");
        expect(map.get([])).not.to.deep.equal(entriesClone);
        expect(entriesClone).to.deep.equal(entries);
    });

    it('constructor(entries, { copy: "reference", keyLength: 2 })', () => {
        const entries: RecursiveObject<string, string> = { a: { b: "test" }, b: { a: "test2" } };
        const entriesClone = jsonClone(entries);
        const map = new CompositeObject(entriesClone, { copy: "reference", keyLength: 2 });
        expect(map.get([])).to.equal(entriesClone);
        map.set(["a", "b"], "test3");
        expect(map.get([])).to.equal(entriesClone);
        expect(entriesClone).not.to.deep.equal(entries);
    });

    it('constructor(entries, { copy: "invalid", keyLength: 2 })', () => {
        expect(() => new CompositeObject({}, { copy: "invalid" as any, keyLength: 2 })).to.throw(
            /^Unrecognized copy method 'invalid'$/,
        );
    });

    it("constructor(entries)", () => {
        expect(() => new CompositeObject<string, string>({}, undefined as any)).to.throw(
            /^Object inputs require a non-zero value for options.keyLength$/,
        );
    });

    it(".prototype.delete(key) [while iterating]", () => {
        // The Composite Object iterators must cache the object keys while iterating, requiring me to verify that
        // the properties still exist while iterating them.
        const map = new CompositeObject<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");

        let mapCopy = new CompositeObject(map);
        const entries = mapCopy.entries();
        expect(entries.next().value).to.deep.equal([["a", "b"], "test"]);
        mapCopy.delete(["b", "a"]);
        expect(entries.next().done).to.equal(true);

        mapCopy = new CompositeObject(map);
        const keys = mapCopy.keys();
        expect(keys.next().value).to.deep.equal(["a", "b"]);
        mapCopy.delete(["b", "a"]);
        expect(keys.next().done).to.equal(true);

        mapCopy = new CompositeObject(map);
        const values = mapCopy.values();
        expect(values.next().value).to.equal("test");
        mapCopy.delete(["b", "a"]);
        expect(values.next().done).to.equal(true);
    });
});

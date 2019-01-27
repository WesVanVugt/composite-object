// tslint:disable:no-console
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

const DEFINITIONS_FILE = path.resolve(__dirname, "../../index.d.ts");

function getRecursiveObjectTypes(count: number, keys: string[]): string {
    return Array.from(new Array(count))
        .map((_, i) => {
            if (!i) {
                return "export declare type RecursiveObject1<K1 extends string, V> = {\n    [P in K1]?: V;\n}";
            } else {
                return (
                    `export declare type RecursiveObject${i + 1}<` +
                    keys
                        .slice(0, i + 1)
                        .map((key) => `${key} extends string`)
                        .join(", ") +
                    `, V> = {\n` +
                    `    [P in K1]?: RecursiveObject${i}<${keys.slice(1, i + 1).join(", ")}, V>;\n` +
                    `};`
                );
            }
        })
        .join("\n");
}

function getCompositeMapDefinition(index: number, keys: string[]): string {
    const joinedKeys = keys.join(", ");
    const keySubsets = Array.from(new Array(keys.length + 1)).map(
        (_, i) => `[${keys.slice(0, keys.length - i).join(", ")}]`,
    );
    const qualifiedKeys: string = keys.map((key) => `${key} extends string`).join(", ");
    return (
        `export declare class CompositeObject${index + 1}<${qualifiedKeys}, V> {\n` +
        [
            `constructor();`,
            `constructor(` +
                `entries: CompositeObject${index + 1}<${joinedKeys}, V> | ` +
                `CompositeObject<${keys.join(" | ")}, V>, ` +
                `options?: CompositeObjectOptions` +
                `);`,
            `constructor(` +
                `entries: RecursiveObject${index + 1}<${joinedKeys}, V> | RecursiveObject<${keys.join(" | ")}, V>, ` +
                `options: CompositeObjectOptions & { keyLength: ${index + 1} }` +
                `);`,
            `set(key: [${joinedKeys}], value: V): this;`,
            `clear(): void;`,
            `delete(key: ${keySubsets.join(" | ")}): boolean;`,
            `has(key: ${keySubsets.join(" | ")}): boolean;`,
            `get(key: ${keySubsets[0]}): V | undefined;`,
            ...keySubsets
                .slice(1)
                .map(
                    (key, i) =>
                        `get(key: ${key}): RecursiveObject${i + 1}<${keys.slice(-1 - i).join(", ")}, V> | undefined;`,
                ),
            `forEach(callbackfn: (value: V, key: ${keySubsets[0]}) => void): void;`,
            `keys(): IterableIterator<${keySubsets[0]}>;`,
            `values(): IterableIterator<V>;`,
            `entries(): IterableIterator<[${keySubsets[0]}, V]>;`,
            `[Symbol.iterator](): IterableIterator<[${keySubsets[0]}, V]>;`,
            `toJSON(): RecursiveObject${index + 1}<${joinedKeys}, V>;`,
        ]
            .map((v) => `    ${v}\n`)
            .join("") +
        `}`
    );
}

function getCompositeMapDefinitions(keys: string[]): string {
    return keys.map((_, i) => getCompositeMapDefinition(i, keys.slice(0, i + 1))).join("\n");
}

function main(): void {
    let content = fs.readFileSync(DEFINITIONS_FILE).toString();
    const regExp = new RegExp(`^export declare const CompositeObject(\\d+): typeof CompositeObject;$`, "gm");
    let firstIndex: number = -1;
    let lastIndex: number = -1;
    let count = 0;
    for (;;) {
        const matches = regExp.exec(content);
        if (!matches) {
            break;
        }
        count++;
        assert.strictEqual(+matches[1], count);
        if (firstIndex === -1) {
            firstIndex = matches.index;
        }
        lastIndex = regExp.lastIndex;
    }
    assert.ok(count);
    assert.strictEqual(content.slice(firstIndex, lastIndex).split("\n").length, count);
    const keys = Array.from(new Array(count)).map((_v, x) => `K${x + 1}`);

    content =
        content.slice(0, firstIndex) +
        getRecursiveObjectTypes(count, keys) +
        "\n" +
        getCompositeMapDefinitions(keys) +
        content.slice(lastIndex + 1);
    content = content.replace(
        `constructor(entries: CompositeObject<K, V>,`,
        `constructor(entries: CompositeObject<K, V> | ${keys
            .map((_, i) => `CompositeObject${i + 1}<${"any, ".repeat(i + 1)}V>`)
            .join(" | ")},`,
    );
    fs.writeFileSync(DEFINITIONS_FILE, content, "utf8");
}

main();

import { CompositeObject, CompositeObject2, RecursiveObject, RecursiveObject2 } from "composite-object";

enum StringEnum {
    One = "one",
    Two = "two",
}

it("Typing Test", () => {
    const map = new CompositeObject2<"a", "b", boolean>();
    assertType<CompositeObject2<"a", "b", boolean>>(new CompositeObject2(map));
    assertType<CompositeObject2<"a", "b", boolean>>(new CompositeObject2(map.toJSON(), { keyLength: 2 }));
    assertType<CompositeObject2<"a", "b", boolean>>(
        new CompositeObject2<"a", "b", boolean>(map.toJSON() as RecursiveObject<"a" | "b", boolean>, {
            keyLength: 2,
        }),
    );
    assertType<CompositeObject2<"a", "b", boolean>>(
        new CompositeObject2<"a", "b", boolean>(new CompositeObject<"a" | "b", boolean>()),
    );
    assertType(new CompositeObject(new CompositeObject2<"a", "b", boolean>()));
    assertType<CompositeObject2<StringEnum, string, boolean>>(new CompositeObject2<StringEnum, string, boolean>());
    assertType<RecursiveObject2<"a", "b", boolean>>({ a: { b: true } });
    assertType<boolean>(map.delete([]));
    assertType<boolean>(map.delete(["a"]));
    assertType<boolean>(map.delete(["a", "b"]));
    map.clear();
    map.set(["a", "b"], true);
    assertType<boolean | undefined>(map.get(["a", "b"]));
    assertType<{ b?: boolean } | undefined>(map.get(["a"]));
    assertType<{ a?: { b?: boolean } } | undefined>(map.get([]));
    assertType<boolean>(map.has([]));
    assertType<boolean>(map.has(["a"]));
    assertType<boolean>(map.has(["a", "b"]));
    map.forEach((value, key) => {
        assertType<boolean>(value);
        assertType<["a", "b"]>(key);
    });
    assertType<IterableIterator<boolean>>(map.values());
    assertType<IterableIterator<["a", "b"]>>(map.keys());
    assertType<IterableIterator<[["a", "b"], boolean]>>(map.entries());
    assertType<{ a?: { b?: boolean } }>(map.toJSON());
});

function assertType<T>(_v: T): void {
    // Only used for typechecking at compile
}

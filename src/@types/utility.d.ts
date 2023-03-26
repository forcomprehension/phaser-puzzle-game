
type PickEnum<T, K extends T> = {
    [P in keyof K]: P extends K ? P : never;
};

type Nullable<T> = T | null;

type Optional<T> = T | undefined;

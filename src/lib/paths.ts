function parts(path: string): string[] {
  return path.split('.');
}

export function getIn(source: unknown, path: string): unknown {
  let node = source;
  for (const part of parts(path)) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

function assign(node: unknown, keys: string[], value: unknown): unknown {
  const [head, ...rest] = keys;
  if (head === undefined) return value;
  if (Array.isArray(node)) {
    const copy: unknown[] = [...node];
    const index = Number(head);
    copy[index] = assign(copy[index], rest, value);
    return copy;
  }
  const record = (typeof node === 'object' && node !== null ? node : {}) as Record<string, unknown>;
  return { ...record, [head]: assign(record[head], rest, value) };
}

/** Immutable set by dot path. The caller supplies the type; paths are checked at the call sites by shape. */
export function setIn<T>(source: T, path: string, value: unknown): T {
  return assign(source, parts(path), value) as T;
}

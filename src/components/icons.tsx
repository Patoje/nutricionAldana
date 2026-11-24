// Íconos de interfaz del kit (dibujados con currentColor).

export function ArrowIcon() {
  return (
    <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path className="m-arrow__stem" d="M1 6h8" />
      <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
    </svg>
  );
}

export function Logo({ name }: { name: string }) {
  return (
    <a className="nav__logo" href="#top">
      <span className="mark" data-mark="dots" aria-hidden="true" />
      {name}
    </a>
  );
}

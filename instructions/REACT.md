# React Standards

## React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

## React & Frontend

- **Mobile-first — NON-NEGOTIABLE.** Start with the phone layout, enhance upward for tablet and web.
- Rules of Hooks (top level only).
- Touch targets must be large enough for fingers (minimum 44px).
- Semantic design tokens over hardcoded colors — never `#fff` or `bg-white` in components.
- Destructive actions MUST use a confirmation dialog, never wired directly.
- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags
- Use ref as a prop instead of `React.forwardRef`

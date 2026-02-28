

## Plan: Add Form Customization to Spaces

### Approach
Clicking "Edit" on a space card opens a detail/editor view (slide-over panel or full page) with tabs: **General**, **Form Builder**, and **Thank You Page**. The form builder lets users configure the collection form fields per space.

### Implementation Steps

1. **Create `SpaceEditorPanel.tsx`** — A slide-over sheet (using `Sheet` from shadcn) with three tabs:
   - **General** — Space name, slug, active toggle, branding (logo, accent color)
   - **Form Builder** — Drag-to-reorder list of form fields (name, email, rating, text, video, custom questions). Each field has: label, required toggle, type selector. Add/remove fields. Live mini-preview on the right.
   - **Thank You** — Customize thank-you message, redirect URL, CTA button text

2. **Add form config to Space interface** — Extend the `Space` type with a `formFields` array and `thankYouConfig` object to hold per-space form settings.

3. **Wire "Edit" button** — Clicking "Edit" on a space card sets the selected space and opens the Sheet editor panel.

4. **Live form preview** — Inside the Form Builder tab, show a real-time mini-preview of what the collection form will look like as the user adds/removes/reorders fields.

### Files to Create/Edit
- **Create** `src/components/SpaceEditorPanel.tsx` — The sheet-based editor with tabs
- **Edit** `src/pages/dashboard/SpacesPage.tsx` — Add state for selected space, wire Edit button, render the editor panel


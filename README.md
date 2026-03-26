# See Solution Below!

# Cards & Transactions Overview – Frontend Exercise

This exercise is a small frontend application that simulates a banking-style overview page.

The goal is to build a page where a user can view payment cards, select one of them, and inspect its transactions. The user must also be able to filter the transactions by amount.

A rough interface sketch is included in the repository to illustrate the intended layout and interaction. The design is only guidance — a pixel-perfect implementation is **not required**.

**Expected time investment:** ~4 hours

![image](docs/cardTransactionDesigns.png)


## Functional Requirements

### Card Selection

* Display a list of payment cards
* The user can select one of the cards
* The selected card becomes the active context of the page

### Transactions

* When a card is selected, show the transactions belonging to that card
* The transactions should visually relate to the selected card (for example: matching background color or another clear visual connection)

### Filtering

* A numeric filter field must exist between the cards and the transactions list
* The user can enter an amount
* Only transactions with an amount **greater than or equal to** the entered value remain visible
* When the user switches to another card, the filter input resets

## Technical Setup

Use the framework relevant to the role you applied for (e.g. React, Vue, etc.).

You may:

* use the included starter project, or
* create your own setup from scratch

You are free to add any libraries you consider appropriate (state management, routing, testing tools, UI helpers, etc.).

If you use the starter project:

```bash
yarn
```

## Data Source

The repository contains example data inside `src/data` as JSON files.

You may use this data as the backing data for the application.
However, the application should be implemented as if the data were loaded from an external API rather than directly from static imports.

In other words, structure your solution so that replacing the local data with real network requests would not require major changes to the application architecture.

## General Expectations

We are interested in how you approach implementing a feature in a small application.

If you complete the core requirements early, you are welcome to extend the solution further or refine parts of the implementation. Additional improvements are optional and should not be necessary to submit a valid solution.

### Junior

A working implementation that follows the described behavior and is reasonably understandable.

### Mid-Level

A well-structured and maintainable solution with clear organization and thoughtful implementation choices.

### Senior

A solution that reflects engineering maturity and consideration for long-term maintainability and scalability.

## What to Include in Your Submission

Please provide:

* the full source code
* a short `README` explaining:

  * how to run the project
  * assumptions or tradeoffs you made
  * what you would improve with more time

The goal of this exercise is to understand your technical decisions and development approach when implementing a real feature.

# Solution Summary

## Wireframes

<img width="602" height="894" alt="Bildschirmfoto 2026-03-26 um 19 00 10" src="https://github.com/user-attachments/assets/523f205d-54ba-4e8c-abbb-0881f274ebdb" />

<img width="500" height="642" alt="Bildschirmfoto 2026-03-26 um 19 00 26" src="https://github.com/user-attachments/assets/1ede7fd6-1b3c-42f2-9edb-721b62d161a6" />

<img width="612" height="491" alt="Bildschirmfoto 2026-03-26 um 19 00 38" src="https://github.com/user-attachments/assets/f6365cac-0c47-440a-a020-857f32750fe8" />

### Styling was inspired by TailwindCSS Components to follow best UI/UX patterns

## UI / Mobile View

Desktop:
<img width="1509" height="779" alt="Bildschirmfoto 2026-03-26 um 19 02 42" src="https://github.com/user-attachments/assets/729e0359-638d-4d1f-9ca6-fd5ab20a432f" />


Mobile:
<img width="484" height="783" alt="Bildschirmfoto 2026-03-26 um 19 02 59" src="https://github.com/user-attachments/assets/5c276c3e-2894-49db-98ce-d1854e72b000" />

## Lighthouse Diagnosis 
Accessiblity should be improved due to the smaller color contrast ratios
<img width="228" height="131" alt="Bildschirmfoto 2026-03-26 um 17 10 06" src="https://github.com/user-attachments/assets/e8a00d2b-0569-49a2-8cf8-30eb40109976" />

## Test Report

### Unit/Integration Tests

<img width="967" height="976" alt="Bildschirmfoto 2026-03-26 um 19 07 20" src="https://github.com/user-attachments/assets/a6c1d2bd-d887-43eb-af98-30e7d4474f30" />

### E2E Tests with Playwright

<img width="719" height="135" alt="Bildschirmfoto 2026-03-26 um 19 08 41" src="https://github.com/user-attachments/assets/3187eeb5-ee16-414a-a1af-c1223e094687" />

### If I had more time

1. I would make sure that the Accessibility measurement of the webpage was without errors, and hence find a better color combination for the application.
2. I would have deployed the app and created a build pipeline.
3. I would have made the application more scalable. Since all of the transactions will be listed for a certain card at once, this can lead to issues without a Pagination or Virtualisation implementation. I would have created one of these to account for a more scalable solution.
4. I would make the application more international. For example, I use formatting for Germany when it comes to the price formatting in this app.

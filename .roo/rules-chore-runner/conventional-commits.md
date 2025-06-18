# Semantic Git Messaging: A Guide to Conventional Commits

Git is a powerful version control system, but writing clear and meaningful commit messages is often overlooked. Poor commit messages can make it hard to track changes, debug issues, or collaborate effectively. That’s where conventional commits come in.

In this guide, we’ll explore how to structure Git commits using prefixes like `feat`, `fix`, and `chore` to improve code clarity and maintainability.

---

## 🚀 Why Use Conventional Commits?

- **Improve project history readability**
- **Streamline collaboration in teams**
- **Enable automation** (e.g., changelog generation, release versioning)
- **Make debugging and rollbacks easier**

---

## 📌 Common Git Commit Types and When to Use Them

### 🔥 `feat`: Adding a New Feature

Use `feat` when introducing a new feature or functionality.

```zsh
git commit -m "feat: add dark mode toggle for user settings"
```

---

### 🐛 `fix`: Bug Fixes

Use `fix` when resolving an issue or bug in the code.

```zsh
git commit -m "fix: resolve issue with course filtering not updating"
```

---

### 🛠️ `chore`: Maintenance & Non-Code Updates

Use `chore` for updates that don’t affect the code logic, such as dependency updates, build changes, or script modifications.

```zsh
git commit -m "chore: update ESLint rules and dependencies"
```

---

### 🎨 `style`: Code Formatting (No Logic Changes)

Use `style` for purely aesthetic changes like indentation, whitespace, or semicolons.

```zsh
git commit -m "style: fix indentation in courseDetail component"
```

---

### 🔄 `refactor`: Code Improvement Without Changing Functionality

Use `refactor` when restructuring code without altering behavior.

```zsh
git commit -m "refactor: optimize database query performance"
```

---

### 📄 `docs`: Documentation Updates

Use `docs` when updating README files, inline comments, or documentation.

```zsh
git commit -m "docs: update API usage guide for user authentication"
```

---

### ⚡ `perf`: Performance Improvements

Use `perf` when optimizing speed or memory usage.

```zsh
git commit -m "perf: improve response time for course search API"
```

---

### 🧪 `test`: Adding or Updating Tests

Use `test` when writing or modifying test cases.

```zsh
git commit -m "test: add unit tests for course enrollment logic"
```

---

### 🔧 `ci`: Changes to CI/CD Configuration

Use `ci` when updating CI/CD pipelines or workflows.

```zsh
git commit -m "ci: update GitHub Actions to trigger tests on PRs"
```

---

## 📝 Best Practices for Writing Commit Messages

- Use the imperative mood (e.g., “fix bug,” not “fixed bug”)
- Keep it concise but clear (aim for 50–72 characters in the first line)
- Add details when necessary (use `-m` for a longer description)

**Example of a detailed commit:**

```zsh
git commit -m "feat: implement course filtering by category" -m "Allows users to filter courses based on selected tags. Uses React state and URL parameters."
```

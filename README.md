# CommentMarkdown Render

A VS Code extension that automatically filters out comment symbols when the mouse hovers over comments and renders plain text in Markdown format in a floating window.

## Functional Features

1. ✅ ** only compatible with multi-line comments ** (excluding multi-line '//')

2. ✅ ** multilingual support ** : automatically match comment formats based on different programming languages

3. ✅ **Markdown rendering ** : supports full Markdown syntax

4. ✅ ** comprehensive testing ** : Each function has corresponding test cases

Supported languages

- TypeScript/JavaScript (JSX/TSX)

- Java

- C/C++/C#

- Go, Rust, PHP, Swift, Kotlin, Scala

- Python

- HTML/XML

- CSS/SCSS/Less

- SQL

## Usage Method

Install the extension

2. In supported language files, hover the mouse over multi-line comments

3. View the content rendered in Markdown

## Example

Input (Annotation)

````typescript

/ *

* # Function Description

*

This function is used for:

*

* - Process user input

Verify the data

* - Return the result

*

** * Note **: Parameters cannot be empty

* /

function processData(input: string) {

//...

}

` ` `



Output (Hover display)



Rendered Markdown with:



- Formatted title

A clear list

- ** Bold ** emphasis



"Development"



For more details, please refer to [DEVELOPMENT.md](./DEVELOPMENT.md)



"Test"



```bash

pnpm test

` ` `



Fulfilled requirements



- [x] Only compatible with multi-line comments (excluding multi-line //)

- [x] Match different formats according to different programming languages

- [x] Implements the basic rendering of Markdown

- [x] Write tests for each step



"Permission"



MIT
````

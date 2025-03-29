import { Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {
	statusBarTextElement: HTMLSpanElement;
	// obsidian first loads the plugin and then opens the files
	async onload() {
		this.statusBarTextElement = this.addStatusBarItem().createEl("span")
		// this.statusBarTextElement.textContent = "Hello, World!";

		// we need to listen to the active file change event
		// leaf is the current active file
		this.app.workspace.on("active-leaf-change", async (leaf) => {
			// access the current active file
			const activeFile = this.app.workspace.getActiveFile();
			if (activeFile) {
				// read the content of the active file
				const content = await this.app.vault.read(activeFile);
				// console.log("Active file content:", content);
				// update the status bar with the line count
				this.updateLineCount(content);
			} else {
				this.updateLineCount(undefined); // if no file is active
			}
		})

		// change the line count in real time
		this.app.workspace.on("editor-change", async (editor) => {
			// access the current content
			const content = editor.getDoc().getValue();
			this.updateLineCount(content);
		})
    }
	
	// a private method to count the number of lines in a file
	private updateLineCount(content: string | undefined) {
		// split the content by new line and filter out empty lines
		const lines = content ? content.split(/\r\n|\r|\n/).length : 0;
		const lineText = lines === 1 ? "line" : "lines";
		this.statusBarTextElement.textContent = `${lines} ${lineText}`;
	}

	onunload() {
		console.log("Plugin unloaded");
    }
}

import { Editor, Plugin } from "obsidian";
import { Configuration, OpenAIApi } from "openai";
import { SettingTab } from "./settings";

interface OpenAIPluginSettings {
	apiKey: string;
}

const DEFAULT_SETTINGS: Partial<OpenAIPluginSettings> = {
	apiKey: "",
};

export default class OpenAIPlugin extends Plugin {
	settings: OpenAIPluginSettings;

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async loadOpenAi() {
		const configuration = new Configuration({
			apiKey: this.settings.apiKey,
		});

		return new OpenAIApi(configuration);
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		this.addCommand({
			id: "openai",
			name: "Run Prompt",
			editorCallback: async (editor: Editor) => {
				const openai = await this.loadOpenAi();
				const selection = editor.getSelection();
				const completion = await openai.createCompletion("text-davinci-001", {
					prompt: selection,
					temperature: 0.8,
					top_p: 1,
					max_tokens: 500,
				});
				editor.replaceSelection(selection + completion.data.choices[0].text);
			},
		});
	}
}

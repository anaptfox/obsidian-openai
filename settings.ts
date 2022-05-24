import OpenAIPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingTab extends PluginSettingTab {
	plugin: OpenAIPlugin;

	constructor(app: App, plugin: OpenAIPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("OpenAI API Key")
			.setDesc("The API key for the OpenAI API. This is required for the OpenAI plugin to work. You may obtain a key from https://beta.openai.com/account/api-keys")
			.addText((text) =>
				text
					.setPlaceholder("OpenAI API key")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						console.log(value);
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

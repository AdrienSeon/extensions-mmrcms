import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const SUBMANGA_DOMAIN = "https://submanga.io";

export const SubmangaInfo: SourceInfo = {
	version: "1.0.0",
	name: "Submanga",
	description: "Extension that pulls manga from submanga.io",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: SUBMANGA_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Spanish",
			type: TagType.GREY,
		},
	],
};

export class Submanga extends Mmrcms {
	baseUrl: string = SUBMANGA_DOMAIN;
	languageCode: LanguageCode = LanguageCode.SPANISH;
	sourceTraversalPathName: string = "manga";
}
import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const ZAHARD_DOMAIN = "https://zahard.top";

export const ZahardInfo: SourceInfo = {
	version: "1.0.0",
	name: "Zahard",
	description: "Extension that pulls manga from zahard.top",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: ZAHARD_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
	],
};

export class Zahard extends Mmrcms {
	baseUrl: string = ZAHARD_DOMAIN;
	languageCode: LanguageCode = LanguageCode.ENGLISH;
	sourceTraversalPathName: string = "manga";
}
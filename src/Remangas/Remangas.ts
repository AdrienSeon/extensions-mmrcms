import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const REMANGAS_DOMAIN = "https://remangas.top";

export const RemangasInfo: SourceInfo = {
	version: "1.0.0",
	name: "Remangas",
	description: "Extension that pulls manga from remangas.top",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: REMANGAS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Portuguese",
			type: TagType.GREY,
		},
	],
};

export class Remangas extends Mmrcms {
	baseUrl: string = REMANGAS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.PORTUGUESE;
	sourceTraversalPathName: string = "manga";
}
import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const READCOMICSONLINERU_DOMAIN = "https://readcomicsonline.ru";

export const ReadComicsOnlineRuInfo: SourceInfo = {
	version: "1.0.0",
	name: "ReadComicsOnline.ru",
	description: "Extension that pulls manga from readcomicsonline.ru",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: READCOMICSONLINERU_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
	],
};

export class ReadComicsOnlineRu extends Mmrcms {
	baseUrl: string = READCOMICSONLINERU_DOMAIN;
	languageCode: LanguageCode = LanguageCode.ENGLISH;
	sourceTraversalPathName: string = "comic";
}
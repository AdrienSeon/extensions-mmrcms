import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const JPMANGAS_DOMAIN = "https://jpmangas.co";

export const JpmangasInfo: SourceInfo = {
	version: "1.0.0",
	name: "Jpmangas",
	description: "Extension that pulls manga from jpmangas.co",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: JPMANGAS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "French",
			type: TagType.GREY,
		},
	],
};

export class Jpmangas extends Mmrcms {
	baseUrl: string = JPMANGAS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "lecture-en-ligne";
}
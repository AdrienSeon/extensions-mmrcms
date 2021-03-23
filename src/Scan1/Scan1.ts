import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const SCAN1_DOMAIN = "https://wwv.scan-1.com";

export const Scan1Info: SourceInfo = {
	version: "1.0.0",
	name: "Scan-1",
	description: "Extension that pulls manga from scan-1.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: SCAN1_DOMAIN,
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

export class Scan1 extends Mmrcms {
	baseUrl: string = SCAN1_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "";
}
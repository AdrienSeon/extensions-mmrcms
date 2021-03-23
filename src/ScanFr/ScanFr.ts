import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const SCANFR_DOMAIN = "https://www.scan-fr.cc";

export const ScanFrInfo: SourceInfo = {
	version: "1.0.0",
	name: "Scan-fr",
	description: "Extension that pulls manga from scan-fr.cc",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: SCANFR_DOMAIN,
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

export class ScanFr extends Mmrcms {
	baseUrl: string = SCANFR_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "manga";
}
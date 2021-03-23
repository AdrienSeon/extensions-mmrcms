import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const SCANVF_DOMAIN = "https://www.scan-vf.net";

export const ScanVfInfo: SourceInfo = {
	version: "1.0.0",
	name: "Scan-vf",
	description: "Extension that pulls manga from scan-vf.net",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: SCANVF_DOMAIN,
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

export class ScanVf extends Mmrcms {
	baseUrl: string = SCANVF_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
    sourceTraversalPathName: string = "";
}
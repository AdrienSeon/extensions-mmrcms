import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const SCANOP_DOMAIN = "https://scan-op.cc";

export const ScanOpInfo: SourceInfo = {
	version: "1.0.0",
	name: "Scan-op",
	description: "Extension that pulls manga from scan-op.cc",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: SCANOP_DOMAIN,
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

export class ScanOp extends Mmrcms {
	baseUrl: string = SCANOP_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "manga";
}
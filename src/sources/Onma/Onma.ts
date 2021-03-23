import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../..";

const ONMA_DOMAIN = "https://onma.me";

export const OnmaInfo: SourceInfo = {
	version: "1.0.0",
	name: "مانجا اون لاين",
	description: "Extension that pulls manga from onma.me",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: ONMA_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Arabic",
			type: TagType.GREY,
		},
	],
};

export class Onma extends Mmrcms {
	baseUrl: string = ONMA_DOMAIN;
	languageCode: LanguageCode = LanguageCode.UNKNOWN; // ! ARABIC enum not implemented
	sourceTraversalPathName: string = "manga";
}

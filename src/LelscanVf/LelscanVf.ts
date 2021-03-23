import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const LELSCANVF_DOMAIN = "https://lelscan-vf.co";

export const LelscanVfInfo: SourceInfo = {
	version: "1.0.0",
	name: "Lelscan-vf",
	description: "Extension that pulls manga from lelscan-vf.co",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: LELSCANVF_DOMAIN,
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

export class LelscanVf extends Mmrcms {
	baseUrl: string = LELSCANVF_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "manga";
}
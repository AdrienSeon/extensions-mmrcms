import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const OPVF_DOMAIN = "https://op-vf.com";

export const OpVfInfo: SourceInfo = {
	version: "1.0.0",
	name: "Op-vf",
	description: "Extension that pulls manga from op-vf.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: OPVF_DOMAIN,
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

export class OpVf extends Mmrcms {
	baseUrl: string = OPVF_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "manga";
}
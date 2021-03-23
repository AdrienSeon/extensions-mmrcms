import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const KOMIKMANGA_DOMAIN = "https://adm.komikmanga.com";

export const KomikMangaInfo: SourceInfo = {
	version: "1.0.0",
	name: "KomikManga",
	description: "Extension that pulls manga from adm.komikmanga.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: KOMIKMANGA_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Polish",
			type: TagType.GREY,
		},
	],
};

export class KomikManga extends Mmrcms {
	baseUrl: string = KOMIKMANGA_DOMAIN;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceTraversalPathName: string = "manga";
}
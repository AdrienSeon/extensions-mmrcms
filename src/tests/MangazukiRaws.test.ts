import cheerio from 'cheerio'
import { MmrcmsAPIWrapper } from "../MmrcmsAPIWrapper";
import { Mmrcms } from "../Mmrcms";
import { MangazukiRaws } from "../MangazukiRaws/MangazukiRaws";

describe("MangazukiRaws Tests", function () {
	const wrapper: MmrcmsAPIWrapper = new MmrcmsAPIWrapper();
	const source: Mmrcms = new MangazukiRaws(cheerio);
    const chai = require("chai");
    const expect = chai.expect;
	const should = chai.should();
	const chaiAsPromised = require("chai-as-promised");

	chai.use(chaiAsPromised);

	/**
	 * The Manga ID which this unit test uses to base it's details off of.
	 * Try to choose a manga which is updated frequently, so that the historical checking test can
	 * return proper results, as it is limited to searching 30 days back due to extremely long processing times otherwise.
	 */
	const mangaId = "hero-manager";

	it("Retrieve Manga Details", async () => {
		const details = await wrapper.getMangaDetails(source, mangaId);

		expect(details, "No results found with test-defined ID [" + mangaId + "]").to.exist;

		const data = details;

		expect(data.id, "Missing ID").to.be.not.empty;
		expect(data.image, "Missing Image").to.be.not.empty;
		expect(data.status, "Missing Status").to.exist;
		expect(data.author, "Missing Author").to.be.not.empty;
		expect(data.desc, "Missing Description").to.be.not.empty;
		expect(data.titles, "Missing Titles").to.be.not.empty;
		expect(data.rating, "Missing Rating").to.exist;
	});

	it("Get Chapters", async () => {
		const data = await wrapper.getChapters(source, mangaId);

		expect(data, "No chapters present for: [" + mangaId + "]").to.not.be.empty;

		const entry = data[0];

		expect(entry.id, "No ID present").to.not.be.empty;
		expect(entry.time, "No date present").to.exist;
		expect(entry.name, "No title available").to.not.be.empty;
		expect(entry.chapNum, "No chapter number present").to.exist;
	});

	it("Get Chapter Details", async () => {
		const chapters = await wrapper.getChapters(source, mangaId);
		const data = await wrapper.getChapterDetails(source, mangaId, chapters[0].id);

		expect(data, "No server response").to.exist;
		expect(data, "Empty server response").to.not.be.empty;
		expect(data.id, "Missing ID").to.be.not.empty;
		expect(data.mangaId, "Missing MangaID").to.be.not.empty;
		expect(data.pages, "No pages present").to.be.not.empty;
	});

	it("Testing search", async () => {
		const testSearch = createSearchRequest({ title: "he" });
		const search = await wrapper.searchRequest(source, testSearch, { page: 0 });
		const result = search.results[0];

		expect(result, "No response from server").to.exist;
		expect(result.id, "No ID found for search query").to.be.not.empty;
		expect(result.image, "No image found for search").to.be.not.empty;
		expect(result.title, "No title").to.be.not.null;
		expect(result.subtitleText, "No subtitle text").to.be.not.null;
	});

	it("Testing Home-Page aquisition", async () => {
		const homePages = await wrapper.getHomePageSections(source);

		expect(homePages, "No response from server").to.exist;
	});

	it("Testing home page results for RECENTLY UPDATED titles", async () => {
		const results = await wrapper.getViewMoreItems(source, "1_recently_updated", {}, 1);
		const resultsWithPagedData = await wrapper.getViewMoreItems(source, "1_recently_updated", {}, 3);

		expect(results, "No results for page 1 for this section").to.exist;
		expect(resultsWithPagedData, "No results for page 3 for this section").to.exist;

		const data = results![0];

		expect(data.id, "No ID present").to.exist;
		expect(data.image, "No image present").to.exist;
		expect(data.title.text, "No title present").to.exist;
	});

	it("Testing home page results for CURRENTLY TRENDING titles", async () => {
		const results = await wrapper.getViewMoreItems(source, "2_currenty_trending", {}, 1);
		const resultsWithPagedData = await wrapper.getViewMoreItems(source, "2_currenty_trending", {}, 3);

		expect(results, "No results for page 1 for this section").to.exist;
		expect(resultsWithPagedData, "No results for page 3 for this section").to.exist;

		const data = results![0];

		expect(data.id, "No ID present").to.exist;
		expect(data.image, "No image present").to.exist;
		expect(data.title.text, "No title present").to.exist;
	});

	it("Testing Notifications", async () => {
		const updates = await wrapper.filterUpdatedManga(source, new Date("2021-03-14"), [mangaId]);

		expect(updates, "No server response").to.exist;
		expect(updates, "Empty server response").to.not.be.empty;
		expect(updates[0], "No updates").to.not.be.empty;
	});

	it("Testing get tags", async () => {
		const updates = await wrapper.getTags(source);

		expect(updates, "No server response").to.exist;
		expect(updates, "Empty server response").to.not.be.empty;
	});
});
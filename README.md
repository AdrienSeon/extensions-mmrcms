# Paperback Sources

# extensions-mmrcms
Contains Paperback sources using the "my Manga Reader CMS" template.

### Contains sources:
[Onma / مانجا اون لاين](https://onma.me)
[Utsukushii](https://manga.utsukushii-bg.com)
[Fallen Angels](https://manga.fascans.com)
[Manhwas Men](https://manhwas.men)
[Read Comics Online](https://readcomicsonline.ru)
[Zahard](https://zahard.top)
[LeoManga](https://leomanga.me)
[Mangadoor](https://mangadoor.com)
[Mangas.pw](https://mangas.in)
[submanga](https://submanga.io)
[Jpmangas](https://www.jpmangas.com)
[Lelscan-VF](https://lelscan-vf.com)
[Op-VF](https://op-vf.com)
[Scan FR](https://www.scan-fr.cc)
[Scan OP](https://scan-op.cc)
[Scan VF](https://www.scan-vf.net)
[Scan-1](https://scan-1.com)
[Komik Manga](https://adm.komikmanga.com)
[Komikid](https://www.komikid.com)
[MangaID](https://mangaid.click)
[Mangazuki Raws](https://raws.mangazuki.co)
[HentaiShark](https://www.hentaishark.com)
[Nikushima](https://azbivo.webd.pro)
[Phoenix-Scans](https://phoenix-scans.pl)
[Mangás Yuri](https://mangasyuri.net)
[Remangas](https://remangas.top)
[MangaHanta](http://mangahanta.com)
[NoxSubs](https://noxsubs.com)
[Puzzmos](https://puzzmos.com)
[Fallen Angels Scans](https://truyen.fascans.com)

## About Sources
Sources were a highly requested feature for Paperback as it allows users to read manga that are otherwise not on MangaDex (The default source of the app). The sources are community-driven, and may be updated and changed without requiring an application update. This allows for a rolling development process, implementing changes as they come in, rather than waiting for the application developer to implement new sources and bugfixes. 

## Developing A Source
### Source Architecture
The two main driving points why the architecture was developed in such a way is to ensure abstraction and a separation of concerns. The extensions do not have direct access to any http libraries. This is to ensure that the developer cannot access/do more than is required. 
The main driving application architecture is a factory -- it is not aware of any functions other than the ones that are designated are required or optional. The application treats the Source.ts abstract class as a Factory design pattern entry point. The application is able to spawn and run as many sources as it needs to, as long as it's able to instantiate a child of Source.ts. This allows the application to handle all of the unique URLs and HTTP parsing which each source requires, on an individual basis.

![Application Diagram](https://cdn.discordapp.com/attachments/267036594853249041/723990710247882752/Blank_Diagram.png)

Many of the functions have two parts that are required to be implemented -- the request and the formatting. The request functions are there to give back a properly formatted request. The other part of the function takes the data from the completed request and formats the data to fit the models defined by the function signature. 
The following sequence diagram shows how the data flows between the application and source. 

![Sequence Diagram](https://cdn.discordapp.com/attachments/267036594853249041/723994905059262484/Blank_Diagram_-_Page_2_1.png)

### Updating A Source
Updating a source is simple. You just need to change the version number every time you change the code in any way. 

### Source Documentation 

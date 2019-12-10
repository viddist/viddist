const dat = window.DatArchive

export async function readPlaylist (url) {
  console.log('reading playlist')
  const archive = await dat.load(url)
  console.log('read playlist')

  return {
    listName: await archive.readFile('/name.txt'),
    videoList: JSON.parse(await archive.readFile('/videoList.json')),
  }
}
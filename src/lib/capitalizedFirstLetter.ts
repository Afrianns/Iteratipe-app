
export default function capitalizedFirstLetter(title: string) {

  let titleArr = title.split("-")
  let newTitle = []


  for (const word of titleArr) { 
    const firstLetter = word.charAt(0)

    const firstLetterCap = firstLetter.toUpperCase()
  
    const remainingLetters = word.slice(1)
    newTitle.push(firstLetterCap + remainingLetters)
  }

  return newTitle.join(" ")
}
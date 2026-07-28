export default function SubmitButton({loading, name }: {loading: boolean, name: string}) {
  return (
    <>
        {loading ? 
            <button type="button" className="button-style-loading rounded-md">Loading...</button>
        :
            <button type="submit" className="button-style rounded-md">{name}</button>
        }
    </>
  )
}
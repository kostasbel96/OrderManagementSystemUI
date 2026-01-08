
type Props = {
    title: string;
}

const Banner = ({title}: Props) => {
    return (
        <>
            <div className="bg-linear-to-br from-blue-600 to-yellow-400 h-32 flex items-center justify-center text-white">
                <h1 className="sm:text-2xl font-bold drop-shadow-lg">{title}</h1>
            </div>
        </>
    )
}

export default Banner;
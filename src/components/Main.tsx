interface MainProps {
    children: React.ReactNode
}

const Main = ({children}: MainProps) => {
    return (
        <>
            <main className="mx-auto min-h-[80vh] pt-5 bg-gray-200 text-center space-x-2">
                {children}
            </main>
        </>
    )
}

export default Main
import { Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer bg-[#0274f8]">
        <div className="flex flex-row-reverse justify-between p-4 text-white">
            <div>
                <p>Copyright © 2026, Kostas Veloutsos</p>
            </div>
            <div className="flex space-x-3 hover:cursor-pointer">
                <a href="https://www.linkedin.com/in/kostas-veloutsos-026246266/"
                target="_blank"
                >
                    <Linkedin/>
                </a>
                <a href="https://github.com/kostasbel96"
                   target="_blank"
                >
                    <Github/>
                </a>
            </div>

        </div>
        </footer>
    )
}

export default Footer;
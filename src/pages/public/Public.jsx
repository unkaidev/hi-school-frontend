import { useEffect } from 'react';
import './public.scss';

const Public = () => {

    useEffect(() => {
        function centerLoginButton() {
            const button = document.querySelector('.login-button');
            const windowHeight = window.innerHeight;
            const buttonHeight = button.offsetHeight;

            button.style.bottom = `${(windowHeight / 3) - (buttonHeight / 2) - 40}px`;
            button.style.left = `50%`;
            button.style.transform = `translate(-50%, 0)`;
        }

        centerLoginButton();

        window.addEventListener('resize', centerLoginButton);

        return () => {
            window.removeEventListener('resize', centerLoginButton);
        };
    }, []);

    return (
        <>
            <div className="position-relative">
                <img src="/home.jpg" className="img-fluid" alt="Home" />
                <a href="/login" className=" position-absolute translate-middle login-button text-decor" >Login</a>
            </div>
        </>
    )
}
export default Public;

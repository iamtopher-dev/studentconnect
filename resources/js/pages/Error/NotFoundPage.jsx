import React from "react";
import { Link } from "react-router-dom";
import building from "../../assets/images/building.png";

const NotFoundPage = () => {
    return (
        <div
            className="bg-cover bg-no-repeat h-screen w-full bg-blend-overlay bg-black/80 flex items-center justify-center"
            style={{ backgroundImage: `url(${building})` }}
        >
            <div className="text-center space-y-7">
                <h1 className="text-6xl font-bold text-white">404</h1>
                <p className="text-md text-white w-90">
                    It looks like the page you’re searching for isn’t here.
                    Don’t worry head back to the homepage and keep exploring
                    StudentConnect.
                </p>
                <Link
                    to="/"
                    className=" px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/80"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;

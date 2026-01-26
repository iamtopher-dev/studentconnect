import React from "react";
import ContentSpacer from "../../components/common/ContentSpacer";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Home = () => {
    return (
        <ContentSpacer>
            <h1>StudentConnect Online Services</h1>

            <div className="flex gap-10 text-center">
                <div className="space-y-3">
                    <div className="border-1 border-gray-300 bg-white p-2 rounded-lg">
                        <img
                            src="https://cdn.wallpapersafari.com/74/21/WXix2c.jpg"
                            alt=""
                        />
                    </div>
                    <Button label={`Student Portal`} />
                </div>

                <div className="space-y-3">
                    <div className="border-1 border-gray-300 bg-white p-2 rounded-lg">
                        <img
                            src="https://cdn.wallpapersafari.com/74/21/WXix2c.jpg"
                            alt=""
                        />
                    </div>
                    <Button label={`Employee Portal`} />
                </div>
            </div>
        </ContentSpacer>
    );
};
export default Home;

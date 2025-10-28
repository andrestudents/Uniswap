"use client";
import { MyButton } from "@/components/MyButton";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

export default function Try() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col gap-6 items-center roun">
                    <div className="flex w-full flex-col ">
                        <Tabs aria-label="Options">
                            <Tab key="photos" title="Photos">
                                <Card>
                                    <CardBody>
                                        ASU
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="music" title="Music">
                                <Card>
                                    <CardBody>
                                        BAJINGAN
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="videos" title="Videos">
                                <Card>
                                    <CardBody>
                                        CELENG
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                    <h1 className="text-3xl text-gray-400 opacity-50 mb-8">
                        My Custom HeroUI Buttons
                    </h1>
                    {/* Your Custom MyButton */}
                    <MyButton color="olive" size="xl" className="hover:scale-105 transition-transform rounded-full">
                        My Custom Olive Button
                    </MyButton>


                </div>
            </div>
        </main>
    );
}
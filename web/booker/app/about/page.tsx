import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, MapPin, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-4xl space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">About VehicAid</h1>
                    <p className="text-xl text-muted-foreground">Revolutionizing roadside assistance with technology and trust.</p>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                    <p>
                        VehicAid was founded with a simple mission: to make roadside assistance faster, safer, and more transparent.
                        We connect drivers in distress with a network of verified providers instantly, removing the stress from vehicle breakdowns.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">24/7 Availability</h3>
                                <p className="text-muted-foreground text-sm">Our network never sleeps. Get help day or night, anywhere.</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Verified Providers</h3>
                                <p className="text-muted-foreground text-sm">All partners are vetted, licensed, and insured for your safety.</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Real-Time Tracking</h3>
                                <p className="text-muted-foreground text-sm">Watch your provider arrive on the map in real-time.</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Community Focused</h3>
                                <p className="text-muted-foreground text-sm">We are building a community of drivers helping drivers.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-muted p-8 rounded-2xl text-center space-y-4">
                    <h2 className="text-2xl font-bold">Our Operations</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        From easy booking via our web and mobile apps to seamless payment processing and service fulfillment,
                        VehicAid manages the entire lifecycle of roadside assistance. Our subscription models offer peace of mind
                        for every budget.
                    </p>
                </div>
            </div>
        </div>
    );
}

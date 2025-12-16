"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Truck, IdCardLanyard, Receipt, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-2xl sm:text-3xl font-bold">Help & Getting Started</h1>
                <p className="text-zinc-400 text-sm sm:text-base">Learn how to use the Mercury Dashboard effectively</p>
            </div>

            {/* Important Notice */}
            <Card className="border-amber-600/50 bg-amber-950/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-400">
                        <AlertCircle className="w-5 h-5" />
                        Important: Creating Shipments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-300 mb-4">
                        Before you can create a shipment, you must first set up the following:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <Truck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">1. Create a Truck</h3>
                                <p className="text-zinc-400 text-sm">Add at least one truck to your fleet with license plate and max payload.</p>
                                <Link href="/dashboard/trucks">
                                    <Button variant="link" className="text-blue-400 px-0 h-auto mt-2 cursor-pointer">
                                        Go to Trucks <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <IdCardLanyard className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">2. Create an Employee</h3>
                                <p className="text-zinc-400 text-sm">Register a driver with their CNH, CPF, and other required information.</p>
                                <Link href="/dashboard/employees">
                                    <Button variant="link" className="text-blue-400 px-0 h-auto mt-2  cursor-pointer">
                                        Go to Employees <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <Receipt className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">3. Create a Recipient</h3>
                                <p className="text-zinc-400 text-sm">Add the delivery recipient with their contact details and full address.</p>
                                <Link href="/dashboard/recipients">
                                    <Button variant="link" className="text-blue-400 px-0 h-auto mt-2 cursor-pointer">
                                        Go to Recipients <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-emerald-950/20 rounded-lg border border-emerald-600/50">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">4. Create Your Shipment</h3>
                                <p className="text-zinc-400 text-sm">Once you have all three items above, you can create and manage shipments.</p>
                                <Link href="/dashboard/shipments">
                                    <Button variant="link" className="text-emerald-400 px-0 h-auto mt-2 cursor-pointer">
                                        Go to Shipments <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-sm">You can edit or delete any truck, employee, or recipient at any time from their respective pages.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-sm">Track your shipments in real-time on the dashboard map view.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-sm">Add shipment events to log important updates during delivery.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-sm">Monitor your balance and track expenses in the Balance section on the dashboard.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-sm">Update your company settings anytime from the Settings page.</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Getting Started Steps */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Recommended Setup Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold text-sm shrink-0">
                                1
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Configure your company settings</p>
                                <p className="text-zinc-400 text-sm">Add your trade name and company information</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold text-sm shrink-0">
                                2
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Add your trucks</p>
                                <p className="text-zinc-400 text-sm">Register all vehicles in your fleet</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold text-sm shrink-0">
                                3
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Register your drivers</p>
                                <p className="text-zinc-400 text-sm">Add all employees who will be driving</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold text-sm shrink-0">
                                4
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Add recipients</p>
                                <p className="text-zinc-400 text-sm">Create recipient profiles with delivery addresses</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 font-bold text-sm shrink-0">
                                5
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Start creating shipments!</p>
                                <p className="text-zinc-400 text-sm">Begin managing your deliveries efficiently</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

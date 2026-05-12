import axios from "axios";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { useNavigate } from "react-router";

import { PendingPanel, Spinner } from "./InlineLoader";



interface leadInput{

    auditId: any;

    email: any;

    company: any;

    role: any;



}



export function AddLead({setVisibility,auditId} : {setVisibility : any,auditId:string}){

    const [leadData,setLeadData] = useState<leadInput>({

        auditId:auditId,

        email:"",

        company:"",

        role:""



    });

    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleInput(e: ChangeEvent<HTMLInputElement>) {

        const name = e.target.name;

        const value = e.target.value;



        setLeadData((prev)=>{

            return {...prev,[name]:value}

        })

    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault()

        setIsSubmitting(true);

        try{

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/app/lead/capture`,leadData);

            alert("Email Sent Successfully!!");

            navigate(`/audit/${response.data.shareToken}`,{replace : true});

            setVisibility(false)



        }catch(err){

            setIsSubmitting(false);

            alert("Some error occurred!!");



        }

    }





    return(

        <div className="fixed inset-0 z-20 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">

            <div

                role="dialog"

                aria-modal="true"

                aria-labelledby="lead-dialog-title"

                className="relative w-full max-w-md rounded-2xl border border-border bg-surface-raised p-6 shadow-xl"

            >

                {isSubmitting && (

                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-surface-raised/90 p-6 backdrop-blur-[2px]">

                        <PendingPanel message="Sending your report…" />

                    </div>

                )}

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <h2 id="lead-dialog-title" className="text-lg font-semibold text-ink">

                            Get the report by email

                        </h2>

                        <p className="mt-1 text-sm text-muted">

                            We&apos;ll send a link you can share with your team.

                        </p>

                    </div>

                    <button

                        type="button"

                        onClick={()=>setVisibility(false)}

                        disabled={isSubmitting}

                        className="rounded-full border border-border bg-canvas px-3 py-1.5 text-sm text-muted transition-colors hover:bg-blush/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"

                    >

                        Close

                    </button>

                </div>

                <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-6 space-y-4">

                    <div>

                        <label htmlFor="lead-email" className="sr-only">

                            Email

                        </label>

                        <input

                            id="lead-email"

                            type="email"

                            placeholder="Work email"

                            name="email"

                            onChange={handleInput}

                            required

                            disabled={isSubmitting}

                            className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"

                        />

                    </div>



                    <div>

                        <label htmlFor="lead-company" className="sr-only">

                            Company

                        </label>

                        <input

                            id="lead-company"

                            type="text"

                            onChange={handleInput}

                            name="company"

                            placeholder="Company or institution"

                            disabled={isSubmitting}

                            className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"

                        />

                    </div>



                    <div>

                        <label htmlFor="lead-role" className="sr-only">

                            Role

                        </label>

                        <input

                            id="lead-role"

                            type="text"

                            onChange={handleInput}

                            name="role"

                            placeholder="Your role"

                            disabled={isSubmitting}

                            className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"

                        />

                    </div>

                    <div className="pt-2">

                        <button

                            type="submit"

                            disabled={isSubmitting}

                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-90"

                        >

                            {isSubmitting ? (

                                <>

                                    <Spinner size="sm" />

                                    Sending…

                                </>

                            ) : (

                                "Send my audit"

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}


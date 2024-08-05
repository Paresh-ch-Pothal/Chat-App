import React, { useState, useEffect, useRef } from 'react'

export default function Account() {

    const host = "http://localhost:5000";
    const [info, setinfo] = useState({
        name: "", pic: null, email: "", id: ""
    })
    const reffile = useRef(null);
    const refname = useRef(null);
    const [name, setname] = useState("");
    const [pic, setpic] = useState(null);


    const fetchuser = async () => {
        const response = await fetch(`${host}/api/user/getuser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        });
        const json = await response.json();
        console.log(json.user.name);
        setinfo({
            name: json.user.name, pic: json.user.pic, email: json.user.email, id: json.user._id
        })
    }

    //edit name
    const handleEditName = () => {
        refname.current.click();
    }

    const handleSaveName = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userId = info.id;
        const response = await fetch(`${host}/api/user/updatename/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({ name })
        });
        const json = await response.json();
        if (json.success) {
            console.log(json);
            setinfo({ ...info, name: json.user.name });
            window.location.reload();
        }
        else {

        }
    }

    const handleNameChange = (e) => {
        setname(e.target.value);
    }

    //edit image
    const handleEditFile = () => {
        reffile.current.click();
    }

    const handleSaveFile=async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        if (pic) {
          formData.append('pic', pic);
        }
        const token = localStorage.getItem("token");
        const userId = info.id;
        const response = await fetch(`${host}/api/user/updateimage/${userId}`, {
          method: "PUT",
          headers: {
            "auth-token": token
          },
          body: formData
        });
        const json = await response.json();
        if (json.success) {
          console.log(json);
          setinfo({ ...info, pic: json.pic });
        }
        else {

        } 
    }

    const handleFileChange = (e) => {
        setpic(e.target.files[0]);
      };


    useEffect(() => {
        if (localStorage.getItem("token")) {
            fetchuser();
        }
    }, [])
    return (
        <>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Profile</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae elementum enim vitae ullamcorper
                            suspendisse.
                        </p>
                    </div>
                    <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                        <div className="flex items-center gap-x-6">
                            <span><img className="h-16 w-16 rounded-full" src={info.pic} alt="" /><i onClick={handleEditFile} className="fa-solid fa-pen-to-square"></i></span>
                            <div>
                                <span><h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{info.name}</h2><i onClick={handleEditName} className="fa-solid fa-pen-to-square"></i></span>
                                <p className="mt-1 text-lg leading-8 text-gray-600">{info.email}
                                </p>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>

            {/* Modal for File Change */}
            <div className="container">
                <button
                    ref={reffile}
                    type="button"
                    className="btn btn-primary d-none"
                    data-bs-toggle="modal"
                    data-bs-target="#editFileModal"
                >
                    Changing File
                </button>
                <div className="modal fade" id="editFileModal" tabIndex="-1" aria-labelledby="editFileModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editFileModalLabel">Change Profile Image</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="profileImage" className="form-label">Profile Image</label>
                                    <input type="file" className="form-control" id="pic" onChange={handleFileChange} name='pic' />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveFile}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Name Change */}
            <div className="container">
                <button
                    ref={refname}
                    type="button"
                    className="btn btn-primary d-none"
                    data-bs-toggle="modal"
                    data-bs-target="#editNameModal"
                >
                    Changing Name
                </button>
                <div className="modal fade" id="editNameModal" tabIndex="-1" aria-labelledby="editNameModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editNameModalLabel">Change Username</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">UserName</label>
                                    <input type="text" value={name} onChange={handleNameChange} className="form-control" id="name" name='name' />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveName}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

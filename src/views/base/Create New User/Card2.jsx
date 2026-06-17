import React, { useRef, useState } from 'react'
import { Tooltip, Box, Button, Card, CardContent, Grid, } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DrawIcon from '@mui/icons-material/Draw';
import DeleteIcon from '@mui/icons-material/Delete';

function Card2({ openSignature, setOpenSignature, fileInputRefSignature, triggerFileInputSignature, handleSignatureChange,
    handleRemoveSignature, openPhoto, setOpenPhoto, fileInputRef, triggerFileInputPhoto, handleFileChange,
    handleRemovePhoto
}) {


    return (
        <>
            <Card
                sx={{
                    height: { xs: 'calc(100vh - 20px)', sm: 'calc(100vh - -88px)', md: 'calc(100vh - -78px)', lg: 'calc(100vh - 17px)', xl: 'calc(100vh - -90px)' },
                    marginBottom: { xs: '90px', sm: '90px' },
                    width: { sm: '120%', md: '100%' },
                    //  border:"1px solid",
                    //height: { xs: '610px', sm: '770px', md: "769px", lg: "591px", xl: "700px" },
                }}
            >

                <CardContent   >
                    <Grid container style={{ display: "flex", justifyContent: "center", }} >

                        {/* photo */}
                        <Grid className='mt-3'
                            container
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                border: "1px solid var(--primary-bg-color)",
                                height: "180px",
                                width: "180px",
                                '@media (max-width:600px)': {
                                    width: '100%',  // Make the grid take full width on xs
                                    height: '180px'   // Adjust height as needed on smaller screens
                                }
                            }}
                        >

                            {openPhoto["photo"] ? (
                                <img
                                    // src={`data:image/jpeg;base64,${openPhoto.photo}`}

                                    src={openPhoto.preview || openPhoto.photo}
                                    alt="Photo Preview"
                                    style={{
                                        border: "0px solid",
                                        width: "100%",  // Ensure the image fills the width of its container
                                        height: "100%",  // Maintain aspect ratio automatically
                                        maxWidth: "100%",  // Ensure the image does not overflow
                                        objectFit: "contain"  // Maintain aspect ratio while fitting within the box
                                    }}
                                />

                            ) : (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        color: 'gray',
                                        opacity: 0.8,
                                        fontSize: '16px',
                                        textAlign: 'center'
                                    }}
                                >
                                    <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1 }} />
                                    Upload Photo
                                </Box>
                            )}







                        </Grid>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="photoInput"
                            accept="image/*"
                            style={{ border: "1px solid", display: "none" }}
                            onChange={handleFileChange}
                        />


                        <Grid container spacing={1} className='mt-0'
                            justifyContent="center"
                            alignItems="center"
                            marginLeft={-2}


                        >
                            <Grid item xs="auto">

                                <Tooltip title="Upload Photo" arrow>
                                    <Button
                                        sx={{
                                            padding: "3px",
                                            textTransform: 'none',
                                            marginRight: 1,
                                            border: "1px solid var(--tertiary-btn-color)",
                                            color: 'var(--tertiary-btn-color)',
                                            backgroundColor: 'var(--primary-btn-background)',
                                            // backgroundColor: 'var(--tertiary-btn-color)',
                                            '&:hover': {
                                                // backgroundColor: 'var(--tertiary-btn-hoverColor)',
                                                //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}
                                        variant="contained"
                                        color="success"
                                        onClick={triggerFileInputPhoto}


                                    >
                                        <AddPhotoAlternateIcon />
                                    </Button>
                                </Tooltip>

                            </Grid>


                            <Grid item xs="auto">
                                <Tooltip title="Remove Photo" arrow>
                                    <Button
                                        sx={{
                                            padding: "3px",
                                            textTransform: 'none',
                                            marginRight: 1,
                                            border: "1px solid var(--tertiary-btn-color)",
                                            color: 'var(--tertiary-btn-color)',
                                            backgroundColor: 'var(--primary-btn-background)',
                                            // backgroundColor: 'var(--tertiary-btn-color)',
                                            '&:hover': {
                                                // backgroundColor: 'var(--tertiary-btn-hoverColor)',
                                                //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}
                                        variant="contained"
                                        color="success"
                                        onClick={handleRemovePhoto}


                                    >
                                        <DeleteIcon />

                                    </Button>
                                </Tooltip>

                            </Grid>



                        </Grid>



                        {/* sign */}

                        <Grid className='mt-5'
                            container
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                marginTop: "0px",
                                border: "1px solid var(--primary-bg-color)",
                                height: "180px",
                                width: "180px",
                                '@media (max-width:600px)': {
                                    width: '100%',  // Make the grid take full width on xs
                                    height: '180px'   // Adjust height as needed on smaller screens
                                }
                            }}
                        >
                            {openSignature["signature"] ? (

                                <img
                                    // src={`data:image/jpeg;base64,${openSignature.signature}`}

                                    src={openSignature.preview || openSignature.signature}
                                    alt="Signature Preview"

                                    style={{
                                        border: "0px solid",
                                        width: "100%",  // Ensure the image fills the width of its container
                                        height: "100%",  // Maintain aspect ratio automatically
                                        maxWidth: "100%",  // Ensure the image does not overflow
                                        objectFit: "contain"  // Maintain aspect ratio while fitting within the box
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        color: 'gray',
                                        opacity: 0.8,
                                        fontSize: '16px',
                                        textAlign: 'center'
                                    }}
                                >
                                    <DrawIcon sx={{ fontSize: 40, mb: 1 }} />
                                    Upload Signature
                                </Box>
                            )}
                        </Grid>

                        <input
                            ref={fileInputRefSignature}
                            type="file"
                            id="signatureInput"
                            accept="image/*"
                            style={{ border: "1px solid", display: "none" }}
                            onChange={handleSignatureChange}
                        />


                        <Grid container spacing={1} className='mt-0'
                            justifyContent="center"
                            alignItems="center"
                            marginLeft={-2}
                        >
                            <Grid item xs="auto">

                                <Tooltip title="Upload Signature" arrow>
                                    <Button
                                        sx={{
                                            padding: "3px",
                                            textTransform: 'none',
                                            marginRight: 1,
                                            border: "1px solid var(--tertiary-btn-color)",
                                            color: 'var(--tertiary-btn-color)',
                                            backgroundColor: 'var(--primary-btn-background)',
                                            // backgroundColor: 'var(--tertiary-btn-color)',
                                            '&:hover': {
                                                // backgroundColor: 'var(--tertiary-btn-hoverColor)',
                                                //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}

                                        variant="contained"
                                        color="success"

                                        onClick={triggerFileInputSignature} // Ensures clicking the box triggers the function


                                    >
                                        <DrawIcon />
                                    </Button>
                                </Tooltip>

                            </Grid>


                            <Grid item xs="auto">
                                <Tooltip title="Remove Signature" arrow>
                                    <Button
                                        sx={{
                                            padding: "3px",
                                            textTransform: 'none',
                                            marginRight: 1,
                                            border: "1px solid var(--tertiary-btn-color)",
                                            color: 'var(--tertiary-btn-color)',
                                            backgroundColor: 'var(--primary-btn-background)',
                                            // backgroundColor: 'var(--tertiary-btn-color)',
                                            '&:hover': {
                                                // backgroundColor: 'var(--tertiary-btn-hoverColor)',
                                                //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}
                                        variant="contained"
                                        color="success"
                                        onClick={handleRemoveSignature} // Attach the remove function


                                    >
                                        <DeleteIcon />

                                    </Button>
                                </Tooltip>

                            </Grid>



                        </Grid>




                    </Grid>


                </CardContent>

            </Card>
        </>
    )
}

export default Card2

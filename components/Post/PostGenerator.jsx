"use client";
import React, { useState, useRef } from "react";
import css from "@/styles/PostGenerator.module.css";
import Box from "../Box";
import { Avatar, Button, Flex, Image, Input, Typography } from "antd";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";

const PostGenerator = () => {
  const [postText, setPostText] = useState("");
  const { user } = useUser();
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const [fileType, setFileType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleRemoveFile = () =>{
    setSelectedFile(null);
    setFileType(null);
  }
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    // put a limit of 5mb file size
    if (file && file.size > 5 * 1024 * 1024) {
      console.log("File size is too big");
      return;
    }

    if (
      file &&
      (file.type.startsWith("image/") || file.type.startsWith("video/"))
    ) {
      setFileType(file.type.split("/")[0]);

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        setSelectedFile(reader.result);
      };
    }
  };
  return (
    <>
      <div className={css.postGenWrapper}>
        <Box className={css.container}>
          <Flex vertical gap={"1rem"} align={"flex-start"}>
            <Flex style={{ width: "100%" }} gap={"1rem"}>
              <Avatar
                src={user?.imageUrl}
                style={{
                  boxShadow: "var(--avatar-shadow)",
                  width: "2.6rem",
                  height: "2.6rem",
                }}
              />
              <Input.TextArea
                // maxLength={100}
                placeholder={"Share what you are thinking..."}
                style={{ height: 80, resize: "none", flex: 1 }}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
            </Flex>

            {fileType && (
              <div className={css.previewContainer}>
                <Button
                  type="default"
                  className={css.remove}
                  style={{ position: "absolute" }}
                >
                  <Typography
                    className="typoCaption"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </Typography>
                </Button>
                {fileType === "image" && (
                  <Image
                    src={selectedFile}
                    className={css.preview}
                    alt="preview"
                    height={"350px"}
                    width={"100%"}
                  />
                )}
                {fileType === "video" && (
                  <video
                    className={css.preview}
                    controls
                    src={selectedFile}
                    height={"350px"}
                  />
                )}
              </div>
            )}

            <Flex
              className="css.buttons"
              align="center"
              justify="space-between"
            >
              {/* image upload button  */}
              <Button
                type="text"
                style={{ background: "borderColor" }}
                onClick={() => imgInputRef.current.click()}
              >
                <Flex align="center" gap={"0.5rem"}>
                  <Icon
                    icon={"solar:camera-linear"}
                    width="1.2rem"
                    color="var(--primary)"
                  />
                  <Typography className="typoSubtitle2">Image</Typography>
                </Flex>
              </Button>

              {/* video upload button  */}
              <Button
                type="text"
                style={{ background: "borderColor" }}
                onClick={() => vidInputRef.current.click()}
              >
                <Flex align="center" gap={"0.5rem"}>
                  <Icon icon="gridicons:video" width="1.2rem" color="#5856D6" />
                  <Typography className="typoSubtitle2">Video</Typography>
                </Flex>
              </Button>

              {/* post button  */}
              <Button
                type="primary"
                style={{ marginLeft: "auto" }}
                // onClick={handleSubmitPost}
              >
                <Flex align="center" gap={".5rem"}>
                  <Icon icon="iconamoon:send-fill" width="1.2rem" />
                  <Typography
                    className="typoSubtitle2"
                    style={{ color: "white" }}
                  >
                    Post
                  </Typography>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </Box>
      </div>

      {/* hidden buttons  */}
      <input
        type="file"
        accept="image/*"
        multiple={false}
        style={{ display: "none" }}
        ref={imgInputRef}
        onChange={(e) => handleFileChange(e)}
      />

      <input
        type="file"
        accept="video/*"
        multiple={false}
        style={{ display: "none" }}
        ref={vidInputRef}
        onChange={(e) => handleFileChange(e)}
      />
    </>
  );
};

export default PostGenerator;

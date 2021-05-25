import jsPDF from "jspdf";

const useSaveAs = () => {
  const savePdf = (stageRef) => {
    let pdf = new jsPDF("l", "px", [window.innerWidth, window.innerHeight]);
    pdf.setTextColor("#000000");
    // first add texts, if there is any
    /* stageRef.current.find("Text").forEach((text) => {
      const size = text.fontSize() / 0.75; // convert pixels to points
      pdf.setFontSize(size);
      pdf.text(text.text(), text.x(), text.y(), {
        baseline: "top",
        angle: -text.getAbsoluteRotation(),
      });
    }); */

    // then put image on top of texts (so texts are not visible)
    pdf.addImage(
      stageRef.current.toDataURL({ pixelRatio: 5 }), // increases quality by 5 times
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    let name = prompt("Enter file name");
    pdf.save(name);
  };

  const downloadImageURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const savePng = (stageRef) => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 5 });
    /* toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter (defaults to PNG). The returned image is in a resolution of 96 dpi. If the height or width of the canvas is 0 or larger than the maximum canvas size, the string "data:," is returned */
    // console.log(uri);
    // we also can save uri as file
    let name = prompt("Enter file name");
    downloadImageURI(uri, `${name}.png`);
  };

  const saveJPG = (stageRef) => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 5 });
    /* toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter (defaults to PNG). The returned image is in a resolution of 96 dpi. If the height or width of the canvas is 0 or larger than the maximum canvas size, the string "data:," is returned */
    // console.log(uri);
    // we also can save uri as file
    let name = prompt("Enter file name");
    downloadImageURI(uri, `${name}.jpeg`);
  };

  return { savePdf, savePng, saveJPG };
};

export default useSaveAs;

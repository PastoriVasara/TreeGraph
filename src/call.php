<?php

header('Content-Type: application/json');
include('connectSQL.php');
$bar = isset($_POST['str']) ? $_POST['str'] : 'kusee';

$fullQuery = 'SELECT  linkedcourse.ID AS Parent, parent.CODE as Parent_Code, parent.NAME AS Parent_Course, linkedcourse.LINKEDID AS Child, child.CODE AS Child_Code, child.NAME AS Child_Course 
FROM linkedcourse JOIN course_shrinked parent ON linkedcourse.ID = parent.ID JOIN course_shrinked child ON linkedcourse.LINKEDID = child.ID WHERE parent.UNIT = "'.$bar.'" ORDER BY Parent.UNIT ASC';
$IDsFROM = array();
$childrenIDsFROM = array();
$courseNamesFROM = array();

$IDsTO = array();
$childrenIDsTO = array();
$courseNamesTO = array();

if ($returnValue = mysqli_query($conn, $fullQuery)) {
    if (mysqli_num_rows($returnValue) > 0) {
        while ($row = mysqli_fetch_array($returnValue)) {
            
            $IDsFROM[] = $row[0];
            $childrenIDsFROM[] = preg_replace('/[^(\x20-\x7F)]*/','', $row[1]);
            $courseNamesFROM[] =  preg_replace('/[^(\x20-\x7F)]*/','', $row[2]);
            $IDsTO[] = $row[3];
            $childrenIDsTO[] =preg_replace('/[^(\x20-\x7F)]*/','', $row[4]);
            $courseNamesTO[] =  preg_replace('/[^(\x20-\x7F)]*/', '', $row[5]);           
        }
    }   
}
else
{
}
echo json_encode(array($IDsFROM,$childrenIDsFROM, $courseNamesFROM, $IDsTO , $childrenIDsTO , $courseNamesTO));
    /*
    $stmt = $db->query('SELECT * FROM data WHERE id=1');
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $tag_name = $row['tag_name']; 
    $client_id = $row['client_id'];
    }
    echo json_encode(array($tag_name,$client_id));
    */
?>
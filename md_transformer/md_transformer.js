#! /usr/bin/env -S node --no-warnings
import {Buffer} from 'buffer';
import process from "process";
import N3 from 'n3';

if(typeof(window) !== "undefined"){
    window.Buffer = Buffer;
    window.process = process;
    window.fs = fs;
}
import fs from 'fs';
import rdfParser from "rdf-parse";
import stringToStream from "string-to-stream"
import {Command} from 'commander';
import 'buffer';
const store = new N3.Store();

const program = new Command();
program
  .name('owl-parser')
  .version('1.0.0')
  .summary("Parses an owl file to fit into md standards.")

  .option('--options <json>|@<file>')
  .description(``);


program.parse(process.argv);

// const options=program.opts();


for(let file of program.args)
  owlParser(file);

async function owlParser(file) {
    let text = fs.readFileSync(file);
    let arr = [];
    let storeStream;

    let contextObj;
    let groups;

    let textStream = stringToStream(text);
    const quadStream = rdfParser.default.parse(textStream, { contentType: 'application/ld+json'});
    // quadStream
    //   .on('context', (context) => contextObj = context)
    //   .on('data', (quads) => {
    //     console.log("C:",contextObj);
    //     let obj = {"subject": quads.subject.value, "predicate": quads.predicate.value, "object": quads.object.value, "graph": quads.graph.value};
    //     arr.push(obj);
    //   })
    //   .on('end', () => {
    //     groups = groupBy(arr, "subject");
    //     console.log(groups);
    //   })

    storeStream=store.import(quadStream);
 
    for await (const quads of storeStream) { 
      let obj = {"subject": quads.subject.value, "predicate": quads.predicate.value, "object": quads.object.value, "graph": quads.graph.value};
      arr.push(obj);
    }

    groups = groupBy(arr, "subject");

    

    for (let group of groups)
      makeMD(group);



}

function makeMD(group){
  let lastIndex = group[0].subject.lastIndexOf('/');
  let group_name = group[0].subject.substring(lastIndex + 1);
  let group_property = "";
  let group_class = "";
  let properties = "";
  let is_property;
  let group_content = "";
  let group_type = "Class";
  let group_subClassOf = "";
  let group_subClassOf_link = "";
  let group_label = "";
  let group_description = "";
  let group_eqclass_link = "";
  let group_eqclass = "";
  let group_domain = "";
  let group_range = "";
  let group_range_link = "";
  let group_dafis = "";

  //Type
  for (let g of group){
    is_property = false;

    if (g.predicate.includes("#type") && g.object.includes("#Property")){
      group_type = "Property";
    }
    
    //name (label)
    if (g.predicate.includes("#name")){
      group_label = g.object;
      properties += "Label: " + group_label + "\n";
    }

    //label
    if (g.predicate.includes("#label")){
      group_label = g.object;
      properties += "Label: " + group_label + "\n";
    }

    //subClassOf
    if (g.predicate.includes("#subClassOf")){
      
      let wd;
      if(g.object.includes('#')){
        wd = g.object.split('#');
        wd = wd[1]
        
      }else{
        let lastIndex = g.object.lastIndexOf('/');
        wd = g.object.substring(lastIndex + 1);
      }
      
      group_subClassOf_link = g.object;
      group_subClassOf = "[" + wd + "](" + group_subClassOf_link +")";    
      properties += "Subclass: " + group_subClassOf + "\n";  
    } 
    
    //dafis_abbrev
    if (g.predicate.includes("#dafis_abbrev")){
      group_dafis = g.object;
      properties += "Dafis Abbreviation: " + group_dafis + "\n";
    }

    //equivalentClass
    if (g.predicate.includes("#equivalentClass")){
      let wd;
      if(g.object.includes('#')){
        wd = g.object.split('#');
        wd = wd[1]
      }else{
        let lastIndex = g.object.lastIndexOf('/');
        wd = g.object.substring(lastIndex + 1);
      }

      group_eqclass_link = g.object;
      group_eqclass = "[" + wd + "](" + group_eqclass_link +")";    
      properties += "Equivalent Class: " + group_eqclass + "\n"; 
    }

    //domain
    if (g.predicate.includes("#domain")){
      let wd = g.object.split(':');
      if(group_domain == ""){
        group_domain = wd[1];
      } 
      else{
        let x = " <br /> " + wd[1];;
        group_domain += x;
      }
    }

    //range
    if (g.predicate.includes("#range")){
      let lastIn = g.object.lastIndexOf('/');
      let nm = g.object.substring(lastIn + 1);
  
      group_range_link = g.object;

      if(group_range == ""){
        group_range = "[" + nm + "](" + group_range_link +")";
      } 
      else{
        let x = " <br /> [" + nm + "](" + group_range_link +")";
        group_range += x;
      }
    }
      
    //Description
    if (g.predicate.includes("description")){
      group_description = g.object;
    }

    if (group_type != "Class"){
      is_property = true
    }      
  
  } 

 //subPropertyOf
  if (is_property){
    group_property = `
      | layout | title |
      | ------------- |:-------------:|
      | schema | UC Davis Library Schema    |

      | Values expected to be one of these types  |
      |:--------:|
      | ${group_domain} |

      | Used on these types  |
      |:--------:|
      | ${group_range} |
      
      **${group_name}** is a ${group_type} of type [schema:${group_type}](http://schema.org/${group_type}).
      ${group_description}
    `;

    group_content = group_property;

  } else {
    group_class = `
      | layout| title |
      | ------------- |:-------------:|
      | schema     | UC Davis Library Schema    |

      **${group_name}** is a ${group_type} of type [schema:${group_type}](http://schema.org/${group_type}).
      ${group_description}

      ${properties}
    `;
    group_content = group_class;

  }

  let md_file = "../_schemas/" + group_name + ".md";
  fs.writeFile(md_file, group_content, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File Created: "+ group_name + " printed.\n\n");
    }
  });

  

}

function groupBy(collection, property) {
  var i = 0, val, index,
      values = [], result = [];
  for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
          result[index].push(collection[i]);
      else {
          values.push(val);
          result.push([collection[i]]);
      }
  }
  return result;
}